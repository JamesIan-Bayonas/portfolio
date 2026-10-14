"""Author and validate one-page briefs from shared portfolio data supplied on stdin."""
import json
from pathlib import Path
import sys
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, BooleanObject, DictionaryObject, NameObject, NumberObject, TextStringObject, ContentStream

ORIGIN = "https://jamesian-portfolio.vercel.app"
INK = HexColor("#14242e")
MUTED = HexColor("#485965")
ACCENT = HexColor("#086b7a")
RULE = HexColor("#ccd8dd")
WIDTH, HEIGHT = A4
MARGIN = 38
BODY_WIDTH = WIDTH - 2 * MARGIN
BODY = ParagraphStyle("body", fontName="Helvetica", fontSize=10.2, leading=14, textColor=INK)
SMALL = ParagraphStyle("small", parent=BODY, fontSize=9, leading=12, textColor=MUTED)


def begin_tag(pdf, role):
    """Record semantic content in draw order, including the two-column flow."""
    mcid = len(pdf.semantic_tags)
    pdf.semantic_tags.append(role)
    pdf._code.append(f"/{role} <</MCID {mcid}>> BDC")
    return mcid


def end_tag(pdf):
    pdf._code.append("EMC")


def tag_document(destination, roles, link_tags):
    """Attach the PDF structure tree and annotation parent-tree entries."""
    writer = PdfWriter(clone_from=str(destination))
    page = writer.pages[0]
    page_ref = page.indirect_reference
    root = DictionaryObject({NameObject("/Type"): NameObject("/StructTreeRoot")})
    root_ref = writer._add_object(root)
    document = DictionaryObject({NameObject("/Type"): NameObject("/StructElem"), NameObject("/S"): NameObject("/Document"), NameObject("/P"): root_ref, NameObject("/Lang"): TextStringObject("en")})
    document_ref = writer._add_object(document)
    elements = ArrayObject()
    for mcid, role in enumerate(roles):
        element = DictionaryObject({NameObject("/Type"): NameObject("/StructElem"), NameObject("/S"): NameObject(f"/{role}"), NameObject("/P"): document_ref, NameObject("/Pg"): page_ref, NameObject("/K"): NumberObject(mcid)})
        elements.append(writer._add_object(element))
    parent_entries = ArrayObject([NumberObject(0), ArrayObject(elements)])
    annotations = page.get("/Annots", [])
    for key, (mcid, label_text) in enumerate(link_tags, 1):
        annotation_ref = annotations[key - 1]
        annotation = annotation_ref.get_object()
        annotation[NameObject("/StructParent")] = NumberObject(key)
        annotation[NameObject("/Contents")] = TextStringObject(label_text)
        element = elements[mcid].get_object()
        element[NameObject("/K")] = ArrayObject([NumberObject(mcid), DictionaryObject({NameObject("/Type"): NameObject("/OBJR"), NameObject("/Obj"): annotation_ref, NameObject("/Pg"): page_ref})])
        parent_entries.extend([NumberObject(key), elements[mcid]])
    document[NameObject("/K")] = elements
    root[NameObject("/K")] = ArrayObject([document_ref])
    root[NameObject("/ParentTree")] = writer._add_object(DictionaryObject({NameObject("/Nums"): parent_entries}))
    root[NameObject("/ParentTreeNextKey")] = NumberObject(len(link_tags) + 1)
    writer.root_object[NameObject("/StructTreeRoot")] = root_ref
    writer.root_object[NameObject("/MarkInfo")] = DictionaryObject({NameObject("/Marked"): BooleanObject(True)})
    writer.root_object[NameObject("/Lang")] = TextStringObject("en")
    writer.root_object[NameObject("/ViewerPreferences")] = DictionaryObject({NameObject("/DisplayDocTitle"): BooleanObject(True)})
    page[NameObject("/StructParents")] = NumberObject(0)
    page[NameObject("/Tabs")] = NameObject("/S")
    with destination.open("wb") as stream:
        writer.write(stream)


def validate_tags(reader, roles, link_tags):
    page = reader.pages[0]
    root = reader.trailer["/Root"]
    if root.get("/Lang") != "en" or page.get("/Tabs") != "/S" or not root["/MarkInfo"]["/Marked"]:
        raise ValueError("Missing language, semantic tab order, or marked-content metadata")
    structure = root["/StructTreeRoot"]
    document = structure["/K"][0].get_object()
    elements = document["/K"]
    actual_roles = [str(element.get_object()["/S"])[1:] for element in elements]
    if actual_roles != roles or roles.count("H1") != 1:
        raise ValueError("Incorrect semantic reading order or main heading")
    nums = structure["/ParentTree"]["/Nums"]
    if len(nums[1]) != len(roles):
        raise ValueError("Missing page parent-tree entries")
    stack = []
    seen = []
    for operands, operator in ContentStream(page.get_contents(), reader).operations:
        if operator in (b"BMC", b"BDC"):
            stack.append(operands[0])
            if operator == b"BDC" and operands[0] != "/Artifact":
                seen.append(int(operands[1]["/MCID"]))
        elif operator == b"EMC":
            if not stack:
                raise ValueError("Unbalanced marked content")
            stack.pop()
        elif operator in (b"Tj", b"TJ", b"'", b'"') and not stack:
            raise ValueError("Untagged visible text")
    if stack or seen != list(range(len(roles))):
        raise ValueError("Invalid marked-content sequence")
    for key, (mcid, label_text) in enumerate(link_tags, 1):
        annotation = page["/Annots"][key - 1].get_object()
        element = elements[mcid].get_object()
        if annotation.get("/Contents") != label_text or annotation.get("/StructParent") != key or element["/S"] != "/Link" or nums[key * 2 + 1] != elements[mcid]:
            raise ValueError("Missing labelled link structure")
        if element["/K"][1].raw_get("/Obj") != page["/Annots"][key - 1]:
            raise ValueError("Link annotation not connected to its structure element")


def clean(value):
    return (value.replace("\u2014", " - ").replace("\u2013", "-")
            .replace("\u2011", "-").replace("\u2192", " > ")
            .replace("\u20b1", "PHP "))


def paragraph(pdf, text, x, y, width, style=BODY):
    item = Paragraph(escape(clean(text)), style)
    _, height = item.wrap(width, HEIGHT)
    begin_tag(pdf, "P")
    item.drawOn(pdf, x, y - height)
    end_tag(pdf)
    return y - height


def label(pdf, text, x, y, role="H2"):
    pdf.setFillColor(ACCENT)
    pdf.setFont("Helvetica-Bold", 8.5)
    begin_tag(pdf, role)
    pdf.drawString(x, y, text.upper())
    end_tag(pdf)
    return y - 12


def block(pdf, title, text, x, y, width, style=BODY):
    y = label(pdf, title, x, y)
    return paragraph(pdf, text, x, y, width, style) - 17


def render(project, output):
    filename = f"{project['id']}-project-brief.pdf"
    destination = output / filename
    pdf = canvas.Canvas(str(destination), pagesize=A4, pageCompression=1, invariant=1, pdfVersion=(1, 7))
    pdf.semantic_tags = []
    pdf.semantic_links = []
    pdf.setTitle(f"{project['name']} - Project Brief")
    pdf.setAuthor("James Ian Bayonas")
    pdf.setSubject("Project contribution, workflow, and engineering decisions")
    pdf.setFillColor(ACCENT)
    pdf._code.append("/Artifact BMC")
    pdf.rect(0, HEIGHT - 8, WIDTH, 8, fill=1, stroke=0)
    end_tag(pdf)
    y = label(pdf, "Project brief / Full-stack engineering", MARGIN, HEIGHT - 42, "P")
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 29)
    begin_tag(pdf, "H1")
    pdf.drawString(MARGIN, y - 24, project["name"])
    end_tag(pdf)
    y -= 39
    subtitle = ParagraphStyle("subtitle", parent=BODY, fontSize=12.5, leading=17)
    y = paragraph(pdf, project["title"], MARGIN, y, BODY_WIDTH, subtitle) - 13
    y = paragraph(pdf, f"James Ian Bayonas  |  {project['role']}  |  {project['context']}", MARGIN, y, BODY_WIDTH, SMALL) - 14
    pdf.setStrokeColor(RULE)
    pdf._code.append("/Artifact BMC")
    pdf.line(MARGIN, y, WIDTH - MARGIN, y)
    end_tag(pdf)
    y -= 22
    study = project["caseStudy"]
    y = block(pdf, "Problem & users", study["problem"], MARGIN, y, BODY_WIDTH)
    y = paragraph(pdf, f"Built for: {study['audience']}", MARGIN, y + 6, BODY_WIDTH, SMALL) - 20
    y = block(pdf, "My contribution", study["contribution"], MARGIN, y, BODY_WIDTH)
    y = block(pdf, "Main technologies", " / ".join(project["tech"]), MARGIN, y, BODY_WIDTH, SMALL)
    y = block(pdf, "Version scope", project["versionLabel"] + ". " + project["versionSummary"], MARGIN, y, BODY_WIDTH, SMALL)
    column = (BODY_WIDTH - 26) / 2
    left = label(pdf, "Workflow", MARGIN, y)
    for index, step in enumerate(study["workflow"], 1):
        left = paragraph(pdf, f"{index:02d}. {step['title']}", MARGIN, left, column) - 11
    left = label(pdf, "System structure", MARGIN, left - 6)
    for node in study["architecture"]:
        left = paragraph(pdf, f"{node['name']}: {node['detail']}", MARGIN, left, column, SMALL) - 8
    right_x = MARGIN + column + 26
    right = block(pdf, "Engineering decision", study["approach"], right_x, y, column)
    right = block(pdf, "Trade-off", study["tradeoff"], right_x, right, column)
    content_bottom = min(left, right)
    if content_bottom < 152:
        raise ValueError(f"{project['name']}: content reaches the link area ({content_bottom:.1f})")
    pdf.setStrokeColor(RULE)
    pdf._code.append("/Artifact BMC")
    pdf.line(MARGIN, 136, WIDTH - MARGIN, 136)
    end_tag(pdf)
    links = [ORIGIN + project["caseStudyPath"], ORIGIN + project["caseStudyPath"] + "#walkthrough", project["source"], ORIGIN + "/"]
    button_width = (BODY_WIDTH - 16) / 3
    for index, (text, url) in enumerate(zip(["READ CASE STUDY", "TRY WALKTHROUGH", "VIEW SOURCE"], links)):
        x = MARGIN + index * (button_width + 8)
        pdf.setFillColor(ACCENT)
        pdf._code.append("/Artifact BMC")
        pdf.roundRect(x, 94, button_width, 28, 3, fill=1, stroke=0)
        end_tag(pdf)
        pdf.setFillColor(white)
        pdf.setFont("Helvetica-Bold", 8)
        mcid = begin_tag(pdf, "Link")
        pdf.drawCentredString(x + button_width / 2, 104, text)
        end_tag(pdf)
        pdf.linkURL(url, (x, 94, x + button_width, 122), relative=0)
        pdf.semantic_links.append((mcid, f"{['Read case study', 'Try sample walkthrough', 'View source code'][index]}: {project['name']}"))
    paragraph(pdf, "Portfolio case studies and walkthroughs provide further detail and sample interactions.", MARGIN, 80, BODY_WIDTH, SMALL)
    pdf.setFont("Helvetica", 8)
    pdf.setFillColor(MUTED)
    mcid = begin_tag(pdf, "Link")
    pdf.drawString(MARGIN, 36, "James Ian Bayonas  /  jamesian-portfolio.vercel.app")
    end_tag(pdf)
    pdf.linkURL(links[-1], (MARGIN, 32, MARGIN + 300, 46), relative=0)
    pdf.semantic_links.append((mcid, "James Ian Bayonas portfolio"))
    pdf._code.append("/Artifact BMC")
    pdf.drawRightString(WIDTH - MARGIN, 36, "1 / 1")
    end_tag(pdf)
    pdf.showPage()
    pdf.save()
    tag_document(destination, pdf.semantic_tags, pdf.semantic_links)
    reader = PdfReader(destination)
    validate_tags(reader, pdf.semantic_tags, pdf.semantic_links)
    if len(reader.pages) != 1:
        raise ValueError(f"Expected a one-page brief for {project['name']}")
    text = reader.pages[0].extract_text()
    normalized_text = " ".join(text.split()).casefold()
    for required in [project["name"], project["role"], project["context"], "My contribution", "Trade-off", project["versionLabel"], project["versionSummary"], study["problem"], study["contribution"], study["approach"], study["tradeoff"], study["audience"]]:
        if " ".join(clean(required).split()).casefold() not in normalized_text:
            raise ValueError(f"Missing content: {required}")
    actual_links = [str(item.get_object()["/A"]["/URI"]) for item in reader.pages[0].get("/Annots", [])]
    if actual_links != links:
        raise ValueError(f"Incorrect PDF links for {project['name']}")
    return {"projectId": project["id"], "filename": filename, "pageCount": 1, "links": links, "language": "en", "tagged": True, "structureElements": len(pdf.semantic_tags), "labelledLinks": len(pdf.semantic_links)}


if __name__ == "__main__":
    sys.stdin.reconfigure(encoding="utf-8")
    sys.stdout.reconfigure(encoding="utf-8")
    output = Path(sys.argv[1])
    projects = json.load(sys.stdin)
    print(json.dumps([render(project, output) for project in projects]))
