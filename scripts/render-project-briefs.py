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
from pypdf import PdfReader

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


def clean(value):
    return (value.replace("\u2014", " - ").replace("\u2013", "-")
            .replace("\u2011", "-").replace("\u2192", " > ")
            .replace("\u20b1", "PHP "))


def paragraph(pdf, text, x, y, width, style=BODY):
    item = Paragraph(escape(clean(text)), style)
    _, height = item.wrap(width, HEIGHT)
    item.drawOn(pdf, x, y - height)
    return y - height


def label(pdf, text, x, y):
    pdf.setFillColor(ACCENT)
    pdf.setFont("Helvetica-Bold", 8.5)
    pdf.drawString(x, y, text.upper())
    return y - 12


def block(pdf, title, text, x, y, width, style=BODY):
    y = label(pdf, title, x, y)
    return paragraph(pdf, text, x, y, width, style) - 17


def render(project, output):
    filename = f"{project['id']}-project-brief.pdf"
    destination = output / filename
    pdf = canvas.Canvas(str(destination), pagesize=A4, pageCompression=1, invariant=1)
    pdf.setTitle(f"{project['name']} - Project Brief")
    pdf.setAuthor("James Ian Bayonas")
    pdf.setSubject("Project contribution, workflow, and engineering decisions")
    pdf.setFillColor(ACCENT)
    pdf.rect(0, HEIGHT - 8, WIDTH, 8, fill=1, stroke=0)
    y = label(pdf, "Project brief / Full-stack engineering", MARGIN, HEIGHT - 42)
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 29)
    pdf.drawString(MARGIN, y - 24, project["name"])
    y -= 39
    subtitle = ParagraphStyle("subtitle", parent=BODY, fontSize=12.5, leading=17)
    y = paragraph(pdf, project["title"], MARGIN, y, BODY_WIDTH, subtitle) - 13
    y = paragraph(pdf, f"James Ian Bayonas  |  {project['role']}  |  {project['context']}", MARGIN, y, BODY_WIDTH, SMALL) - 14
    pdf.setStrokeColor(RULE)
    pdf.line(MARGIN, y, WIDTH - MARGIN, y)
    y -= 22
    study = project["caseStudy"]
    y = block(pdf, "Problem & users", study["problem"], MARGIN, y, BODY_WIDTH)
    y = paragraph(pdf, f"Built for: {study['audience']}", MARGIN, y + 6, BODY_WIDTH, SMALL) - 20
    y = block(pdf, "My contribution", study["contribution"], MARGIN, y, BODY_WIDTH)
    y = block(pdf, "Main technologies", " / ".join(project["tech"]), MARGIN, y, BODY_WIDTH, SMALL)
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
    pdf.line(MARGIN, 136, WIDTH - MARGIN, 136)
    links = [ORIGIN + project["caseStudyPath"], ORIGIN + project["caseStudyPath"] + "#walkthrough", project["source"], ORIGIN + "/"]
    button_width = (BODY_WIDTH - 16) / 3
    for index, (text, url) in enumerate(zip(["READ CASE STUDY", "TRY WALKTHROUGH", "VIEW SOURCE"], links)):
        x = MARGIN + index * (button_width + 8)
        pdf.setFillColor(ACCENT)
        pdf.roundRect(x, 94, button_width, 28, 3, fill=1, stroke=0)
        pdf.setFillColor(white)
        pdf.setFont("Helvetica-Bold", 8)
        pdf.drawCentredString(x + button_width / 2, 104, text)
        pdf.linkURL(url, (x, 94, x + button_width, 122), relative=0)
    paragraph(pdf, "Portfolio case studies and walkthroughs provide further detail and sample interactions.", MARGIN, 80, BODY_WIDTH, SMALL)
    pdf.setFont("Helvetica", 8)
    pdf.setFillColor(MUTED)
    pdf.drawString(MARGIN, 36, "James Ian Bayonas  /  jamesian-portfolio.vercel.app")
    pdf.linkURL(links[-1], (MARGIN, 32, MARGIN + 300, 46), relative=0)
    pdf.drawRightString(WIDTH - MARGIN, 36, "1 / 1")
    pdf.showPage()
    pdf.save()
    reader = PdfReader(destination)
    if len(reader.pages) != 1:
        raise ValueError(f"Expected a one-page brief for {project['name']}")
    text = reader.pages[0].extract_text()
    normalized_text = " ".join(text.split()).casefold()
    for required in [project["name"], project["role"], project["context"], "My contribution", "Trade-off", study["problem"], study["contribution"], study["approach"], study["tradeoff"], study["audience"]]:
        if " ".join(clean(required).split()).casefold() not in normalized_text:
            raise ValueError(f"Missing content: {required}")
    actual_links = [str(item.get_object()["/A"]["/URI"]) for item in reader.pages[0].get("/Annots", [])]
    if actual_links != links:
        raise ValueError(f"Incorrect PDF links for {project['name']}")
    return {"projectId": project["id"], "filename": filename, "pageCount": 1, "links": links}


if __name__ == "__main__":
    sys.stdin.reconfigure(encoding="utf-8")
    sys.stdout.reconfigure(encoding="utf-8")
    output = Path(sys.argv[1])
    projects = json.load(sys.stdin)
    print(json.dumps([render(project, output) for project in projects]))
