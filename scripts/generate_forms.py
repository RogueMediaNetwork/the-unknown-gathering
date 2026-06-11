#!/usr/bin/env python3
"""
Generate the HORRIFY: A Film Speed Run required-paperwork release forms as PDFs.
Outputs into public/forms/ so the static site can serve them for download.

These are TEMPLATE forms, not legal advice.
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)

BLOOD = colors.HexColor("#8B0000")
BLOOD_BRIGHT = colors.HexColor("#B5451B")
INK = colors.HexColor("#1A1A1A")
MUTED = colors.HexColor("#555555")

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "forms")
CONTENT_W = 6.7 * inch

styles = getSampleStyleSheet()

kicker = ParagraphStyle("kicker", parent=styles["Normal"], fontName="Helvetica-Bold",
                        fontSize=7.5, textColor=BLOOD, leading=10, spaceAfter=2,
                        tracking=2)
title = ParagraphStyle("title", parent=styles["Title"], fontName="Helvetica-Bold",
                       fontSize=20, textColor=INK, leading=23, spaceAfter=2, alignment=0)
presented = ParagraphStyle("presented", parent=styles["Normal"], fontName="Helvetica",
                           fontSize=7.5, textColor=MUTED, leading=10, spaceAfter=0)
intro = ParagraphStyle("intro", parent=styles["Normal"], fontName="Helvetica-Oblique",
                       fontSize=8.5, textColor=MUTED, leading=12, spaceBefore=8, spaceAfter=2)
section = ParagraphStyle("section", parent=styles["Heading2"], fontName="Helvetica-Bold",
                         fontSize=10.5, textColor=BLOOD, leading=13, spaceBefore=12, spaceAfter=4)
body = ParagraphStyle("body", parent=styles["Normal"], fontName="Helvetica",
                      fontSize=9, textColor=INK, leading=12.5, alignment=TA_JUSTIFY, spaceAfter=4)
clause = ParagraphStyle("clause", parent=body, leftIndent=14, spaceAfter=5)
label = ParagraphStyle("label", parent=styles["Normal"], fontName="Helvetica",
                       fontSize=9, textColor=INK, leading=12)
disclaimer = ParagraphStyle("disclaimer", parent=styles["Normal"], fontName="Helvetica",
                            fontSize=7, textColor=MUTED, leading=9.5, spaceBefore=4)


def header():
    return [
        Paragraph("HORRIFY: A FILM SPEED RUN", kicker),
    ]


def title_block(form_title):
    return [
        Paragraph("HORRIFY: A FILM SPEED RUN", kicker),
        Paragraph(form_title, title),
        Paragraph("Presented by Waco Independent Film Festival &nbsp;&middot;&nbsp; The PACC &nbsp;&middot;&nbsp; Rogue Media Network",
                  presented),
        Spacer(1, 4),
        HRFlowable(width="100%", thickness=1.2, color=BLOOD, spaceBefore=2, spaceAfter=2),
    ]


def field(label_text, label_w=1.6 * inch, fill_w=None):
    """A labeled fill-in line."""
    if fill_w is None:
        fill_w = CONTENT_W - label_w
    t = Table([[Paragraph(label_text, label), ""]], colWidths=[label_w, fill_w])
    t.setStyle(TableStyle([
        ("LINEBELOW", (1, 0), (1, 0), 0.75, INK),
        ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ("LEFTPADDING", (0, 0), (0, 0), 0),
    ]))
    return t


def two_fields(l1, l2):
    half = CONTENT_W / 2 - 6
    left = field(l1, label_w=0.9 * inch, fill_w=half - 0.9 * inch)
    right = field(l2, label_w=0.9 * inch, fill_w=half - 0.9 * inch)
    t = Table([[left, right]], colWidths=[CONTENT_W / 2, CONTENT_W / 2])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
        ("LEFTPADDING", (0, 0), (0, 0), 0),
        ("RIGHTPADDING", (-1, 0), (-1, 0), 0),
        ("LEFTPADDING", (1, 0), (1, 0), 12),
    ]))
    return t


def signature_block(roles):
    """roles: list of (signer_label) -> signature + printed name + date row each."""
    flow = [Paragraph("Signatures", section)]
    for role in roles:
        flow.append(Paragraph(role, ParagraphStyle("sigrole", parent=label,
                    fontName="Helvetica-Bold", fontSize=9, spaceBefore=8, spaceAfter=2)))
        sig = Table(
            [["", "", ""],
             [Paragraph("Signature", disclaimer), Paragraph("Printed Name", disclaimer),
              Paragraph("Date", disclaimer)]],
            colWidths=[CONTENT_W * 0.42, CONTENT_W * 0.38, CONTENT_W * 0.20]
        )
        sig.setStyle(TableStyle([
            ("LINEBELOW", (0, 0), (2, 0), 0.75, INK),
            ("TOPPADDING", (0, 0), (-1, 0), 18),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 1),
            ("TOPPADDING", (0, 1), (-1, 1), 1),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (1, -1), 14),
        ]))
        flow.append(sig)
    return flow


def disclaimer_block():
    return [
        Spacer(1, 10),
        HRFlowable(width="100%", thickness=0.5, color=MUTED, spaceBefore=2, spaceAfter=4),
        Paragraph(
            "<b>Notice:</b> This is a template form provided as a convenience for participants in HORRIFY: "
            "A Film Speed Run. It is not legal advice and is not guaranteed to be sufficient for any particular "
            "situation. Filmmakers are solely responsible for obtaining all paperwork required for their production "
            "and for ensuring it complies with applicable law; consult a qualified attorney where appropriate. "
            "Completed forms are retained by the filmmaker and must be provided to the organizers upon request. "
            "&copy; 2026 Waco Independent Film Festival &middot; The PACC &middot; Rogue Media Network.",
            disclaimer),
    ]


def build(filename, form_title, flow):
    path = os.path.join(OUT_DIR, filename)
    doc = SimpleDocTemplate(
        path, pagesize=letter,
        leftMargin=0.9 * inch, rightMargin=0.9 * inch,
        topMargin=0.8 * inch, bottomMargin=0.7 * inch,
        title=f"HORRIFY — {form_title}",
        author="HORRIFY: A Film Speed Run",
    )
    story = title_block(form_title) + flow + disclaimer_block()
    doc.build(story)
    print("wrote", os.path.relpath(path))


# ---------------------------------------------------------------------------
# 1. TALENT & CREW RELEASE
# ---------------------------------------------------------------------------
def talent_crew():
    f = []
    f.append(Paragraph(
        "Complete one form for each performer and crew member. This release covers participation in a film "
        "produced for the HORRIFY: A Film Speed Run competition (2026), screened at The Unknown Gathering on "
        "October 10, 2026.", intro))
    f.append(Paragraph("Production", section))
    f.append(field("Film Title:"))
    f.append(field("Director / Production Entity:"))
    f.append(Paragraph("Participant", section))
    f.append(field("Full Legal Name:"))
    f.append(Paragraph("Role:&nbsp;&nbsp; [ ] Talent / Performer &nbsp;&nbsp; [ ] Crew &nbsp;&nbsp; [ ] Both", label))
    f.append(field("Mailing Address:"))
    f.append(two_fields("Email:", "Phone:"))
    f.append(Paragraph("Agreement", section))
    clauses = [
        "<b>1. Grant of Rights.</b> I grant the Director/Production Entity named above (the “Filmmaker”) the "
        "irrevocable right to record, photograph, edit, reproduce, and use my name, likeness, image, voice, and "
        "performance (“Contributions”) in the film titled above (the “Film”) and in connection with "
        "the Film’s production, screening, distribution, marketing, and promotion, in all media now known or later devised.",
        "<b>2. Crew Contributions.</b> If I served as crew, I agree that my creative contributions to the Film are a "
        "“work made for hire.” To the extent any contribution is not a work made for hire, I assign all right, "
        "title, and interest in those contributions to the Filmmaker.",
        "<b>3. No Compensation.</b> I acknowledge that my participation is voluntary and that I am not entitled to any "
        "compensation, royalties, or residuals unless separately agreed in writing.",
        "<b>4. Release of Liability.</b> I participate at my own risk and release the Filmmaker, the Waco Independent "
        "Film Festival, The PACC, Rogue Media Network, and their organizers, staff, and volunteers from any claims "
        "arising out of my participation, to the fullest extent permitted by law.",
        "<b>5. Festival Screening.</b> I understand the Film may be screened publicly at The Unknown Gathering on "
        "October 10, 2026 and at related competition events and promotional channels.",
        "<b>6. Binding Effect.</b> This release is binding upon my heirs, executors, administrators, and assigns.",
    ]
    for c in clauses:
        f.append(Paragraph(c, clause))
    f += signature_block(["Participant"])
    f.append(Paragraph("If Participant is under 18 years of age (Parent / Legal Guardian)", section))
    f += signature_block(["Parent / Legal Guardian"])
    build("horrify-talent-crew-release.pdf", "Talent & Crew Release Form", f)


# ---------------------------------------------------------------------------
# 2. LOCATION AGREEMENT
# ---------------------------------------------------------------------------
def location():
    f = []
    f.append(Paragraph(
        "Complete one form for each filming location. This agreement grants permission to film at a property for a "
        "film produced for the HORRIFY: A Film Speed Run competition (2026).", intro))
    f.append(Paragraph("Production", section))
    f.append(field("Film Title:"))
    f.append(field("Filmmaker / Production Entity:"))
    f.append(Paragraph("Location", section))
    f.append(field("Property Owner / Authorized Agent:"))
    f.append(field("Property Address / Location:"))
    f.append(field("Permitted Date(s) and Times of Use:"))
    f.append(Paragraph("Agreement", section))
    clauses = [
        "<b>1. Permission to Use.</b> The Owner/Agent grants the Filmmaker permission to enter and use the Location on "
        "the date(s) and times above for the purpose of photographing, recording, and filming scenes for the Film, "
        "including the reasonable placement of cast, crew, and equipment.",
        "<b>2. Right to Use Images.</b> The Owner/Agent grants the Filmmaker the right (but not the obligation) to use "
        "images and recordings of the Location — including its structures, grounds, and any visible signage — "
        "in the Film and its promotion, in all media now known or later devised.",
        "<b>3. Condition of Property.</b> The Filmmaker agrees to leave the Location in substantially the same condition "
        "as found, ordinary use excepted, and is responsible for any damage to the Location caused by the production.",
        "<b>4. Assumption of Risk &amp; Indemnification.</b> The Filmmaker assumes responsibility for the production’s "
        "activities at the Location and agrees to indemnify and hold the Owner/Agent harmless from claims arising out of "
        "the production’s negligence, to the fullest extent permitted by law.",
        "<b>5. Compensation.</b> &nbsp; [ ] Use granted at no charge &nbsp;&nbsp; [ ] Agreed location fee: $ __________________",
        "<b>6. Authority.</b> The undersigned represents and warrants that they have full authority to grant the "
        "permissions described in this agreement.",
    ]
    for c in clauses:
        f.append(Paragraph(c, clause))
    f += signature_block(["Property Owner / Authorized Agent", "Filmmaker / Production Entity"])
    build("horrify-location-agreement.pdf", "Location Agreement & Release", f)


# ---------------------------------------------------------------------------
# 3. MUSIC RELEASE
# ---------------------------------------------------------------------------
def music():
    f = []
    f.append(Paragraph(
        "Complete one form for each piece of music used. This release grants the rights needed to use a musical "
        "composition and/or recording in a film produced for the HORRIFY: A Film Speed Run competition (2026).", intro))
    f.append(Paragraph("Production", section))
    f.append(field("Film Title:"))
    f.append(field("Filmmaker / Production Entity:"))
    f.append(Paragraph("Music", section))
    f.append(field("Title of Composition / Recording:"))
    f.append(two_fields("Composer:", "Performer:"))
    f.append(field("Rights Holder (Licensor) Name:"))
    f.append(field("Licensor Contact (email / phone):"))
    f.append(Paragraph("Agreement", section))
    clauses = [
        "<b>1. Grant of License.</b> The Licensor grants the Filmmaker a non-exclusive synchronization and master-use "
        "license to record and use the Music in timed relation with the Film, including the right to reproduce, screen, "
        "distribute, and promote the Film containing the Music at the HORRIFY competition, The Unknown Gathering, and "
        "related events and platforms.",
        "<b>2. Ownership Warranty.</b> The Licensor represents and warrants that they own or control all rights "
        "necessary to grant this license and that the Music does not infringe the rights of any third party.",
        "<b>3. Term &amp; Territory.</b> &nbsp; [ ] Perpetual / Worldwide &nbsp;&nbsp; [ ] Other (specify): "
        "_______________________________________________",
        "<b>4. Compensation.</b> &nbsp; [ ] Granted at no charge / royalty-free &nbsp;&nbsp; [ ] Agreed fee: $ ____________",
        "<b>5. Credit.</b> The Music will be credited substantially as follows:",
    ]
    for c in clauses:
        f.append(Paragraph(c, clause))
    f.append(field("", label_w=14, fill_w=CONTENT_W - 14))
    f += signature_block(["Licensor (Rights Holder)", "Filmmaker / Production Entity"])
    build("horrify-music-release.pdf", "Music Release & Synchronization License", f)


# ---------------------------------------------------------------------------
# 4. STOCK FOOTAGE / THIRD-PARTY MATERIALS LICENSE
# ---------------------------------------------------------------------------
def stock():
    f = []
    f.append(Paragraph(
        "Complete one form for each piece of stock footage, stock imagery, or other third-party material used. This "
        "form confirms that the material is properly licensed for use in a film produced for the HORRIFY: A Film Speed "
        "Run competition (2026).", intro))
    f.append(Paragraph("Production", section))
    f.append(field("Film Title:"))
    f.append(field("Filmmaker / Production Entity:"))
    f.append(Paragraph("Licensed Material", section))
    f.append(field("Description of Footage / Image / Asset:"))
    f.append(two_fields("Source / Provider:", "License Ref #:"))
    f.append(field("License Type (royalty-free, rights-managed, editorial, etc.):"))
    f.append(Paragraph("Confirmation", section))
    clauses = [
        "<b>1. Valid License.</b> The Filmmaker confirms that they have obtained a valid license to use the Material in "
        "the Film, and that the license permits public screening and promotion of the Film at festival and competition "
        "events, including The Unknown Gathering on October 10, 2026.",
        "<b>2. Scope of Use.</b> The Filmmaker’s use of the Material complies with all terms of the underlying "
        "license, including any editorial-use limitations, attribution requirements, or restrictions on modification.",
        "<b>3. Attribution / Credit (if required by the license):</b>",
    ]
    for c in clauses:
        f.append(Paragraph(c, clause))
    f.append(field("", label_w=14, fill_w=CONTENT_W - 14))
    f.append(Paragraph(
        "<b>4. Warranty.</b> The Filmmaker represents and warrants that the Material is properly licensed and that its "
        "use in the Film does not infringe the rights of any third party.", clause))
    f.append(Paragraph(
        "<b>5. Documentation.</b> &nbsp; [ ] A copy of the license / proof of purchase is attached &nbsp;&nbsp; "
        "[ ] Available upon request", clause))
    f += signature_block(["Filmmaker / Production Entity"])
    build("horrify-stock-footage-license.pdf", "Stock Footage & Third-Party Materials License", f)


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    talent_crew()
    location()
    music()
    stock()
    print("done")
