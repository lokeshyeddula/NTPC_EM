import os
from io import BytesIO
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    Paragraph,
    Spacer,
    SimpleDocTemplate,
    Table,
    TableStyle,
)

from inspections.models import InspectionResult


# ============================================================
# COMMON SETTINGS
# ============================================================

NAVY = colors.HexColor("#102A72")
BLUE = colors.HexColor("#1D4ED8")
LIGHT_BLUE = colors.HexColor("#EAF2FF")
VERY_LIGHT_BLUE = colors.HexColor("#F5F8FF")

GREEN = colors.HexColor("#15803D")
LIGHT_GREEN = colors.HexColor("#DCFCE7")

RED = colors.HexColor("#DC2626")
LIGHT_RED = colors.HexColor("#FEE2E2")

GRAY = colors.HexColor("#64748B")
LIGHT_GRAY = colors.HexColor("#F8FAFC")
BORDER = colors.HexColor("#CBD5E1")
DARK = colors.HexColor("#172033")
WHITE = colors.white


# ============================================================
# ASSET PATHS
# ============================================================

def get_asset_paths():
    """
    First looks for logos inside reporting/assets.
    Falls back to frontend/src/assets so existing deployment
    structure continues to work.
    """

    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Preferred location
    reporting_assets = os.path.join(
        current_dir,
        "assets",
    )

    ntpc_logo = os.path.join(
        reporting_assets,
        "Ntpc_logo.png",
    )

    nml_logo = os.path.join(
        reporting_assets,
        "nml_logo.png",
    )

    # Fallback to existing frontend assets
    if not os.path.exists(ntpc_logo) or not os.path.exists(nml_logo):

        frontend_assets = os.path.abspath(
            os.path.join(
                current_dir,
                "..",
                "..",
                "frontend",
                "src",
                "assets",
            )
        )

        fallback_ntpc = os.path.join(
            frontend_assets,
            "Ntpc_logo.png",
        )

        fallback_nml = os.path.join(
            frontend_assets,
            "nml_logo.png",
        )

        if os.path.exists(fallback_ntpc):
            ntpc_logo = fallback_ntpc

        if os.path.exists(fallback_nml):
            nml_logo = fallback_nml

    return ntpc_logo, nml_logo


# ============================================================
# COMMON STYLES
# ============================================================

def get_pdf_styles():

    styles = getSampleStyleSheet()

    styles.add(
        ParagraphStyle(
            name="PDFTitle",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=17,
            leading=20,
            alignment=TA_CENTER,
            textColor=NAVY,
            spaceAfter=3,
        )
    )

    styles.add(
        ParagraphStyle(
            name="PDFSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            alignment=TA_CENTER,
            textColor=GRAY,
        )
    )

    styles.add(
        ParagraphStyle(
            name="PDFReportTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            alignment=TA_CENTER,
            textColor=DARK,
        )
    )

    styles.add(
        ParagraphStyle(
            name="PDFSection",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=13,
            alignment=TA_LEFT,
            textColor=NAVY,
            spaceBefore=3,
            spaceAfter=6,
        )
    )

    styles.add(
        ParagraphStyle(
            name="PDFBody",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor=DARK,
        )
    )

    styles.add(
        ParagraphStyle(
            name="PDFSmall",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=9,
            textColor=DARK,
        )
    )

    styles.add(
        ParagraphStyle(
            name="PDFSmallCenter",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=9,
            alignment=TA_CENTER,
            textColor=DARK,
        )
    )

    styles.add(
        ParagraphStyle(
            name="PDFTableHeader",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=7.5,
            leading=9,
            alignment=TA_CENTER,
            textColor=WHITE,
        )
    )

    return styles


# ============================================================
# PAGE NUMBER / FOOTER
# ============================================================

def add_page_number(canvas, doc):

    canvas.saveState()

    width, height = doc.pagesize

    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)

    canvas.line(
        doc.leftMargin,
        12 * mm,
        width - doc.rightMargin,
        12 * mm,
    )

    canvas.setFont("Helvetica", 7)

    canvas.setFillColor(GRAY)

    canvas.drawString(
        doc.leftMargin,
        7 * mm,
        "NIRIKSHAN | Digital Machinery Inspection System",
    )

    canvas.drawRightString(
        width - doc.rightMargin,
        7 * mm,
        f"Page {doc.page}",
    )

    canvas.restoreState()


# ============================================================
# COMMON HEADER
# ============================================================

def create_report_header(
    report_title,
    styles,
    logo_height=20 * mm,
):

    ntpc_logo, nml_logo = get_asset_paths()

    left_logo = (
        Image(ntpc_logo, width=25 * mm, height=20 * mm)
        if os.path.exists(ntpc_logo)
        else ""
    )

    right_logo = (
        Image(nml_logo, width=25 * mm, height=20 * mm)
        if os.path.exists(nml_logo)
        else ""
    )

    header_text = [
        Paragraph(
            "NTPC MINING LIMITED",
            styles["PDFTitle"],
        ),
        Paragraph(
            "(A Subsidiary of NTPC Limited)",
            styles["PDFSubtitle"],
        ),
        Spacer(1, 2),
        Paragraph(
            "Talaipalli Coal Mining Project",
            styles["PDFReportTitle"],
        ),
        Paragraph(
            report_title,
            styles["PDFReportTitle"],
        ),
    ]

    center_cell = Table(
        [[item] for item in header_text],
        colWidths=[125 * mm],
    )

    center_cell.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 2),
                ("RIGHTPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 1),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
            ]
        )
    )

    header = Table(
        [
            [
                left_logo,
                center_cell,
                right_logo,
            ]
        ],
        colWidths=[
            35 * mm,
            125 * mm,
            35 * mm,
        ],
    )

    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("LEFTPADDING", (0, 0), (-1, -1), 3),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                (
                    "LINEBELOW",
                    (0, 0),
                    (-1, -1),
                    1.2,
                    NAVY,
                ),
            ]
        )
    )

    return header


# ============================================================
# STATUS HELPERS
# ============================================================

def is_fit_status(status):

    return str(status or "").strip().lower() in [
        "fit",
        "pass",
    ]


def status_text(status):

    return "FIT" if is_fit_status(status) else "UNFIT"


def status_style(status):

    if is_fit_status(status):

        return (
            GREEN,
            LIGHT_GREEN,
        )

    return (
        RED,
        LIGHT_RED,
    )


# ============================================================
# GENERATE INDIVIDUAL INSPECTION PDF
# ============================================================

def generate_inspection_pdf(inspection):

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=15 * mm,
        leftMargin=15 * mm,
        topMargin=12 * mm,
        bottomMargin=18 * mm,
        title=f"Inspection Report - {inspection.inspection_number}",
        author="NIRIKSHAN",
    )

    styles = get_pdf_styles()

    body = []

    # --------------------------------------------------------
    # HEADER
    # --------------------------------------------------------

    body.append(
        create_report_header(
            "Machinery Safety Inspection Report",
            styles,
        )
    )

    body.append(
        Spacer(
            1,
            5 * mm,
        )
    )

    # --------------------------------------------------------
    # REPORT INFORMATION
    # --------------------------------------------------------

    body.append(
        Paragraph(
            "INSPECTION INFORMATION",
            styles["PDFSection"],
        )
    )

    op_status = str(
        inspection.operational_status or ""
    )

    engineer_name = (
        inspection.engineer.full_name
        if inspection.engineer
        else ""
    )

    designation = (
        inspection.engineer.designation
        if inspection.engineer
        else ""
    )

    vehicle_number = (
        inspection.vehicle.machine_number
        if inspection.vehicle
        else ""
    )

    machinery_type = (
        inspection.vehicle.machinery_type.name
        if inspection.vehicle
        and inspection.vehicle.machinery_type
        else ""
    )

    info = [
        [
            "Inspection No.",
            str(inspection.inspection_number or ""),
            "Inspection Date",
            str(inspection.inspection_date or ""),
        ],
        [
            "Engineer",
            engineer_name,
            "Designation",
            designation,
        ],
        [
            "Vehicle No.",
            vehicle_number,
            "Machinery Type",
            machinery_type,
        ],
        [
            "Shift",
            str(inspection.shift or ""),
            "Relay",
            str(inspection.relay or ""),
        ],
        [
            "Operational Status",
            status_text(op_status),
            "",
            "",
        ],
    ]

    info_table = Table(
        info,
        colWidths=[
            35 * mm,
            55 * mm,
            35 * mm,
            55 * mm,
        ],
    )

    info_styles = [
        (
            "GRID",
            (0, 0),
            (-1, -1),
            0.5,
            BORDER,
        ),
        (
            "BACKGROUND",
            (0, 0),
            (0, -1),
            LIGHT_BLUE,
        ),
        (
            "BACKGROUND",
            (2, 0),
            (2, -1),
            LIGHT_BLUE,
        ),
        (
            "FONTNAME",
            (0, 0),
            (0, -1),
            "Helvetica-Bold",
        ),
        (
            "FONTNAME",
            (2, 0),
            (2, -1),
            "Helvetica-Bold",
        ),
        (
            "FONTSIZE",
            (0, 0),
            (-1, -1),
            8,
        ),
        (
            "TEXTCOLOR",
            (0, 0),
            (-1, -1),
            DARK,
        ),
        (
            "VALIGN",
            (0, 0),
            (-1, -1),
            "MIDDLE",
        ),
        (
            "TOPPADDING",
            (0, 0),
            (-1, -1),
            6,
        ),
        (
            "BOTTOMPADDING",
            (0, 0),
            (-1, -1),
            6,
        ),
    ]

    status_color, status_bg = status_style(op_status)

    info_styles.extend(
        [
            (
                "BACKGROUND",
                (1, 4),
                (1, 4),
                status_bg,
            ),
            (
                "TEXTCOLOR",
                (1, 4),
                (1, 4),
                status_color,
            ),
            (
                "FONTNAME",
                (1, 4),
                (1, 4),
                "Helvetica-Bold",
            ),
            (
                "ALIGN",
                (1, 4),
                (1, 4),
                "CENTER",
            ),
        ]
    )

    info_table.setStyle(
        TableStyle(info_styles)
    )

    body.append(info_table)

    body.append(
        Spacer(
            1,
            5 * mm,
        )
    )

    # --------------------------------------------------------
    # SUMMARY
    # --------------------------------------------------------

    results = (
        InspectionResult.objects
        .filter(
            inspection=inspection
        )
        .select_related(
            "inspection_field"
        )
    )

    total = results.count()

    passed = results.filter(
        result="Pass"
    ).count()

    failed = results.filter(
        result="Fail"
    ).count()

    summary_data = [
        [
            Paragraph(
                "<b>TOTAL CHECKPOINTS</b>",
                styles["PDFSmallCenter"],
            ),
            Paragraph(
                "<b>PASSED</b>",
                styles["PDFSmallCenter"],
            ),
            Paragraph(
                "<b>FAILED</b>",
                styles["PDFSmallCenter"],
            ),
            Paragraph(
                "<b>STATUS</b>",
                styles["PDFSmallCenter"],
            ),
        ],
        [
            str(total),
            str(passed),
            str(failed),
            status_text(op_status),
        ],
    ]

    summary_table = Table(
        summary_data,
        colWidths=[
            45 * mm,
            45 * mm,
            45 * mm,
            45 * mm,
        ],
    )

    summary_table.setStyle(
        TableStyle(
            [
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    BORDER,
                ),
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    VERY_LIGHT_BLUE,
                ),
                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER",
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "FONTNAME",
                    (0, 1),
                    (-1, 1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 1),
                    (-1, 1),
                    12,
                ),
                (
                    "TEXTCOLOR",
                    (1, 1),
                    (1, 1),
                    GREEN,
                ),
                (
                    "TEXTCOLOR",
                    (2, 1),
                    (2, 1),
                    RED,
                ),
                (
                    "TEXTCOLOR",
                    (3, 1),
                    (3, 1),
                    status_color,
                ),
                (
                    "BACKGROUND",
                    (3, 1),
                    (3, 1),
                    status_bg,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
            ]
        )
    )

    body.append(summary_table)

    body.append(
        Spacer(
            1,
            5 * mm,
        )
    )

    # --------------------------------------------------------
    # CHECKLIST
    # --------------------------------------------------------

    body.append(
        Paragraph(
            "INSPECTION CHECKLIST",
            styles["PDFSection"],
        )
    )

    checklist = [
        [
            Paragraph(
                "Sl. No.",
                styles["PDFTableHeader"],
            ),
            Paragraph(
                "Inspection Point",
                styles["PDFTableHeader"],
            ),
            Paragraph(
                "Result",
                styles["PDFTableHeader"],
            ),
        ]
    ]

    checklist_styles = [
        (
            "GRID",
            (0, 0),
            (-1, -1),
            0.5,
            BORDER,
        ),
        (
            "BACKGROUND",
            (0, 0),
            (-1, 0),
            NAVY,
        ),
        (
            "VALIGN",
            (0, 0),
            (-1, -1),
            "MIDDLE",
        ),
        (
            "ALIGN",
            (0, 0),
            (0, -1),
            "CENTER",
        ),
        (
            "ALIGN",
            (2, 0),
            (2, -1),
            "CENTER",
        ),
        (
            "FONTSIZE",
            (0, 1),
            (-1, -1),
            8,
        ),
        (
            "TOPPADDING",
            (0, 1),
            (-1, -1),
            5,
        ),
        (
            "BOTTOMPADDING",
            (0, 1),
            (-1, -1),
            5,
        ),
    ]

    for index, item in enumerate(
        results,
        start=1,
    ):

        result_val = str(
            item.result or ""
        )

        field_name = str(
            item.inspection_field.field_name
        )

        checklist.append(
            [
                str(index),
                Paragraph(
                    field_name,
                    styles["PDFSmall"],
                ),
                result_val.upper(),
            ]
        )

        if result_val.lower() == "pass":

            checklist_styles.extend(
                [
                    (
                        "TEXTCOLOR",
                        (2, index),
                        (2, index),
                        GREEN,
                    ),
                    (
                        "BACKGROUND",
                        (2, index),
                        (2, index),
                        LIGHT_GREEN,
                    ),
                    (
                        "FONTNAME",
                        (2, index),
                        (2, index),
                        "Helvetica-Bold",
                    ),
                ]
            )

        elif result_val.lower() == "fail":

            checklist_styles.extend(
                [
                    (
                        "TEXTCOLOR",
                        (2, index),
                        (2, index),
                        RED,
                    ),
                    (
                        "BACKGROUND",
                        (2, index),
                        (2, index),
                        LIGHT_RED,
                    ),
                    (
                        "FONTNAME",
                        (2, index),
                        (2, index),
                        "Helvetica-Bold",
                    ),
                ]
            )

        if index % 2 == 0:

            checklist_styles.append(
                (
                    "BACKGROUND",
                    (0, index),
                    (1, index),
                    LIGHT_GRAY,
                )
            )

    checklist_table = Table(
        checklist,
        colWidths=[
            18 * mm,
            127 * mm,
            35 * mm,
        ],
        repeatRows=1,
    )

    checklist_table.setStyle(
        TableStyle(checklist_styles)
    )

    body.append(checklist_table)

    body.append(
        Spacer(
            1,
            5 * mm,
        )
    )

    # --------------------------------------------------------
    # FLAGGED DEFECTS
    # --------------------------------------------------------

    failed_items = [
        str(
            item.inspection_field.field_name
        )
        for item in results
        if str(item.result or "").lower()
        == "fail"
    ]

    body.append(
        Paragraph(
            "FLAGGED DEFECTS",
            styles["PDFSection"],
        )
    )

    if failed_items:

        defect_rows = []

        for index, defect in enumerate(
            failed_items,
            start=1,
        ):

            defect_rows.append(
                [
                    str(index),
                    Paragraph(
                        defect,
                        styles["PDFSmall"],
                    ),
                ]
            )

        defect_table = Table(
            defect_rows,
            colWidths=[
                15 * mm,
                165 * mm,
            ],
        )

        defect_table.setStyle(
            TableStyle(
                [
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.HexColor("#FCA5A5"),
                    ),
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, -1),
                        LIGHT_RED,
                    ),
                    (
                        "TEXTCOLOR",
                        (0, 0),
                        (-1, -1),
                        RED,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (0, -1),
                        "Helvetica-Bold",
                    ),
                    (
                        "ALIGN",
                        (0, 0),
                        (0, -1),
                        "CENTER",
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "MIDDLE",
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        5,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        5,
                    ),
                ]
            )
        )

        body.append(defect_table)

    else:

        no_defects = Table(
            [
                [
                    Paragraph(
                        "No defects identified during this inspection.",
                        styles["PDFBody"],
                    )
                ]
            ],
            colWidths=[180 * mm],
        )

        no_defects.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, -1),
                        LIGHT_GREEN,
                    ),
                    (
                        "BOX",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.HexColor("#86EFAC"),
                    ),
                    (
                        "TEXTCOLOR",
                        (0, 0),
                        (-1, -1),
                        GREEN,
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        8,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        7,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        7,
                    ),
                ]
            )
        )

        body.append(no_defects)

    body.append(
        Spacer(
            1,
            5 * mm,
        )
    )

    # --------------------------------------------------------
    # REMARKS
    # --------------------------------------------------------

    body.append(
        Paragraph(
            "ENGINEER REMARKS",
            styles["PDFSection"],
        )
    )

    remarks_text = (
        inspection.remarks
        if inspection.remarks
        else "Nil"
    )

    remarks_table = Table(
        [
            [
                Paragraph(
                    str(remarks_text),
                    styles["PDFBody"],
                )
            ]
        ],
        colWidths=[180 * mm],
    )

    remarks_table.setStyle(
        TableStyle(
            [
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    BORDER,
                ),
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, -1),
                    LIGHT_GRAY,
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
            ]
        )
    )

    body.append(remarks_table)

    body.append(
        Spacer(
            1,
            12 * mm,
        )
    )

    # --------------------------------------------------------
    # SIGNATURES
    # --------------------------------------------------------

    signature_table = Table(
        [
            [
                "____________________________",
                "____________________________",
            ],
            [
                "Inspection Engineer",
                "Supervisor / Approving Authority",
            ],
        ],
        colWidths=[
            90 * mm,
            90 * mm,
        ],
    )

    signature_table.setStyle(
        TableStyle(
            [
                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER",
                ),
                (
                    "FONTNAME",
                    (0, 1),
                    (-1, 1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 1),
                    (-1, 1),
                    8,
                ),
                (
                    "TEXTCOLOR",
                    (0, 1),
                    (-1, 1),
                    GRAY,
                ),
                (
                    "TOPPADDING",
                    (0, 1),
                    (-1, 1),
                    5,
                ),
            ]
        )
    )

    body.append(signature_table)

    doc.build(
        body,
        onFirstPage=add_page_number,
        onLaterPages=add_page_number,
    )

    pdf = buffer.getvalue()

    buffer.close()

    return pdf


# ============================================================
# GENERATE SHIFT PDF
# ============================================================

def generate_shift_pdf(
    queryset,
    date_str,
    shift_str,
):

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=12 * mm,
        leftMargin=12 * mm,
        topMargin=12 * mm,
        bottomMargin=18 * mm,
        title="Shift-wise Machinery Inspection Report",
        author="NIRIKSHAN",
    )

    styles = get_pdf_styles()

    cell_style = styles["PDFSmall"]

    cell_style_center = styles["PDFSmallCenter"]

    body = []

    body.append(
        create_report_header(
            "Shift-wise Machinery Inspection Report",
            styles,
        )
    )

    body.append(
        Spacer(
            1,
            4 * mm,
        )
    )

    # --------------------------------------------------------
    # META INFORMATION
    # --------------------------------------------------------

    meta_data = [
        [
            "Report Type",
            "Shift-wise Inspection Report",
            "Date",
            str(date_str),
            "Shift",
            f"{shift_str} Shift",
        ],
        [
            "Project",
            "Talaipalli",
            "",
            "",
            "",
            "",
        ],
    ]

    meta_table = Table(
        meta_data,
        colWidths=[
            25 * mm,
            50 * mm,
            20 * mm,
            45 * mm,
            20 * mm,
            45 * mm,
        ],
    )

    meta_table.setStyle(
        TableStyle(
            [
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    BORDER,
                ),
                (
                    "BACKGROUND",
                    (0, 0),
                    (0, -1),
                    LIGHT_BLUE,
                ),
                (
                    "BACKGROUND",
                    (2, 0),
                    (2, -1),
                    LIGHT_BLUE,
                ),
                (
                    "BACKGROUND",
                    (4, 0),
                    (4, -1),
                    LIGHT_BLUE,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (0, -1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTNAME",
                    (2, 0),
                    (2, -1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTNAME",
                    (4, 0),
                    (4, -1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
            ]
        )
    )

    body.append(meta_table)

    body.append(
        Spacer(
            1,
            4 * mm,
        )
    )

    # --------------------------------------------------------
    # UNIQUE INSPECTIONS
    # --------------------------------------------------------

    unique_inspections = {}

    for item in queryset:

        vehicle_no = (
            item.vehicle.machine_number
            if item.vehicle
            else "Unknown"
        )

        if (
            vehicle_no not in unique_inspections
            or item.id
            > unique_inspections[vehicle_no].id
        ):

            unique_inspections[
                vehicle_no
            ] = item

    final_queryset = sorted(
        unique_inspections.values(),
        key=lambda x: x.id,
    )

    # --------------------------------------------------------
    # TABLE
    # --------------------------------------------------------

    table_data = [
        [
            "Sl. No.",
            "Engineer",
            "Vehicle No.",
            "Machinery Type",
            "Status",
            "Flagged Defects",
            "Remarks",
        ]
    ]

    table_styles = [
        (
            "GRID",
            (0, 0),
            (-1, -1),
            0.5,
            BORDER,
        ),
        (
            "BACKGROUND",
            (0, 0),
            (-1, 0),
            NAVY,
        ),
        (
            "TEXTCOLOR",
            (0, 0),
            (-1, 0),
            WHITE,
        ),
        (
            "FONTNAME",
            (0, 0),
            (-1, 0),
            "Helvetica-Bold",
        ),
        (
            "FONTSIZE",
            (0, 0),
            (-1, 0),
            7.5,
        ),
        (
            "ALIGN",
            (0, 0),
            (-1, -1),
            "CENTER",
        ),
        (
            "VALIGN",
            (0, 0),
            (-1, -1),
            "MIDDLE",
        ),
        (
            "TOPPADDING",
            (0, 0),
            (-1, -1),
            5,
        ),
        (
            "BOTTOMPADDING",
            (0, 0),
            (-1, -1),
            5,
        ),
    ]

    for index, item in enumerate(
        final_queryset,
        start=1,
    ):

        op_status = str(
            item.operational_status or ""
        )

        is_fit = is_fit_status(
            op_status
        )

        status = status_text(
            op_status
        )

        status_color, status_bg = status_style(
            op_status
        )

        failed_items = [
            res.inspection_field.field_name
            for res in item.results.all()
            if str(res.result or "").lower()
            == "fail"
        ]

        failed_text = (
            ", ".join(failed_items)
            if failed_items
            else "-"
        )

        remarks_text = (
            item.remarks
            if item.remarks
            else (
                "Fit for operations"
                if is_fit
                else "Requires maintenance"
            )
        )

        table_data.append(
            [
                str(index),
                Paragraph(
                    item.engineer.full_name
                    if item.engineer
                    else "",
                    cell_style,
                ),
                Paragraph(
                    item.vehicle.machine_number
                    if item.vehicle
                    else "",
                    cell_style_center,
                ),
                Paragraph(
                    item.vehicle.machinery_type.name
                    if item.vehicle
                    and item.vehicle.machinery_type
                    else "",
                    cell_style_center,
                ),
                status,
                Paragraph(
                    failed_text,
                    cell_style,
                ),
                Paragraph(
                    remarks_text,
                    cell_style,
                ),
            ]
        )

        table_styles.extend(
            [
                (
                    "TEXTCOLOR",
                    (4, index),
                    (4, index),
                    status_color,
                ),
                (
                    "BACKGROUND",
                    (4, index),
                    (4, index),
                    status_bg,
                ),
                (
                    "FONTNAME",
                    (4, index),
                    (4, index),
                    "Helvetica-Bold",
                ),
            ]
        )

        if index % 2 == 0:

            table_styles.append(
                (
                    "BACKGROUND",
                    (0, index),
                    (3, index),
                    LIGHT_GRAY,
                )
            )

    report_table = Table(
        table_data,
        colWidths=[
            15 * mm,
            38 * mm,
            30 * mm,
            42 * mm,
            25 * mm,
            65 * mm,
            65 * mm,
        ],
        repeatRows=1,
    )

    report_table.setStyle(
        TableStyle(table_styles)
    )

    body.append(report_table)

    body.append(
        Spacer(
            1,
            12 * mm,
        )
    )

    signature = Table(
        [
            [
                "____________________________",
            ],
            [
                "Shift In-charge / Engineer",
            ],
        ],
        colWidths=[60 * mm],
    )

    signature.setStyle(
        TableStyle(
            [
                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER",
                ),
                (
                    "FONTNAME",
                    (0, 1),
                    (-1, 1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 1),
                    (-1, 1),
                    8,
                ),
            ]
        )
    )

    body.append(
        Table(
            [["", signature]],
            colWidths=[
                180 * mm,
                70 * mm,
            ],
            style=[
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "BOTTOM",
                )
            ],
        )
    )

    doc.build(
        body,
        onFirstPage=add_page_number,
        onLaterPages=add_page_number,
    )

    pdf = buffer.getvalue()

    buffer.close()

    return pdf


# ============================================================
# GENERATE DAILY PDF
# ============================================================

def generate_daily_pdf(
    queryset,
    date_str,
):

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=12 * mm,
        leftMargin=12 * mm,
        topMargin=12 * mm,
        bottomMargin=18 * mm,
        title="Daily Machinery Inspection Report",
        author="NIRIKSHAN",
    )

    styles = get_pdf_styles()

    cell_style = styles["PDFSmall"]

    cell_style_center = styles["PDFSmallCenter"]

    body = []

    body.append(
        create_report_header(
            "Daily Machinery Inspection Report",
            styles,
        )
    )

    body.append(
        Spacer(
            1,
            4 * mm,
        )
    )

    # --------------------------------------------------------
    # UNIQUE VEHICLES
    # --------------------------------------------------------

    unique_inspections = {}

    for item in queryset:

        vehicle_no = (
            item.vehicle.machine_number
            if item.vehicle
            else "Unknown"
        )

        if (
            vehicle_no not in unique_inspections
            or item.id
            > unique_inspections[vehicle_no].id
        ):

            unique_inspections[
                vehicle_no
            ] = item

    final_queryset = sorted(
        unique_inspections.values(),
        key=lambda x: x.id,
    )

    # --------------------------------------------------------
    # META
    # --------------------------------------------------------

    meta_data = [
        [
            "Report Type",
            "Daily Inspection Report",
            "Date",
            str(date_str),
        ],
        [
            "Project",
            "Talaipalli",
            "Total Vehicles",
            str(len(final_queryset)),
        ],
    ]

    meta_table = Table(
        meta_data,
        colWidths=[
            30 * mm,
            60 * mm,
            30 * mm,
            90 * mm,
        ],
    )

    meta_table.setStyle(
        TableStyle(
            [
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    BORDER,
                ),
                (
                    "BACKGROUND",
                    (0, 0),
                    (0, -1),
                    LIGHT_BLUE,
                ),
                (
                    "BACKGROUND",
                    (2, 0),
                    (2, -1),
                    LIGHT_BLUE,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (0, -1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTNAME",
                    (2, 0),
                    (2, -1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
            ]
        )
    )

    body.append(meta_table)

    body.append(
        Spacer(
            1,
            4 * mm,
        )
    )

    # --------------------------------------------------------
    # TABLE
    # --------------------------------------------------------

    table_data = [
        [
            "Sl. No.",
            "Engineer",
            "Vehicle No.",
            "Machinery Type",
            "Last Shift",
            "EOD Status",
            "Flagged Defects",
            "Remarks",
        ]
    ]

    table_styles = [
        (
            "GRID",
            (0, 0),
            (-1, -1),
            0.5,
            BORDER,
        ),
        (
            "BACKGROUND",
            (0, 0),
            (-1, 0),
            NAVY,
        ),
        (
            "TEXTCOLOR",
            (0, 0),
            (-1, 0),
            WHITE,
        ),
        (
            "FONTNAME",
            (0, 0),
            (-1, 0),
            "Helvetica-Bold",
        ),
        (
            "FONTSIZE",
            (0, 0),
            (-1, 0),
            7,
        ),
        (
            "ALIGN",
            (0, 0),
            (-1, -1),
            "CENTER",
        ),
        (
            "VALIGN",
            (0, 0),
            (-1, -1),
            "MIDDLE",
        ),
        (
            "TOPPADDING",
            (0, 0),
            (-1, -1),
            5,
        ),
        (
            "BOTTOMPADDING",
            (0, 0),
            (-1, -1),
            5,
        ),
    ]

    for index, item in enumerate(
        final_queryset,
        start=1,
    ):

        op_status = str(
            item.operational_status or ""
        )

        is_fit = is_fit_status(
            op_status
        )

        status = status_text(
            op_status
        )

        status_color, status_bg = status_style(
            op_status
        )

        failed_items = [
            res.inspection_field.field_name
            for res in item.results.all()
            if str(res.result or "").lower()
            == "fail"
        ]

        failed_text = (
            ", ".join(failed_items)
            if failed_items
            else "-"
        )

        remarks_text = (
            item.remarks
            if item.remarks
            else (
                "Operational"
                if is_fit
                else "Requires maintenance"
            )
        )

        table_data.append(
            [
                str(index),
                Paragraph(
                    item.engineer.full_name
                    if item.engineer
                    else "",
                    cell_style,
                ),
                Paragraph(
                    item.vehicle.machine_number
                    if item.vehicle
                    else "",
                    cell_style_center,
                ),
                Paragraph(
                    item.vehicle.machinery_type.name
                    if item.vehicle
                    and item.vehicle.machinery_type
                    else "",
                    cell_style_center,
                ),
                Paragraph(
                    str(item.shift or ""),
                    cell_style_center,
                ),
                status,
                Paragraph(
                    failed_text,
                    cell_style,
                ),
                Paragraph(
                    remarks_text,
                    cell_style,
                ),
            ]
        )

        table_styles.extend(
            [
                (
                    "TEXTCOLOR",
                    (5, index),
                    (5, index),
                    status_color,
                ),
                (
                    "BACKGROUND",
                    (5, index),
                    (5, index),
                    status_bg,
                ),
                (
                    "FONTNAME",
                    (5, index),
                    (5, index),
                    "Helvetica-Bold",
                ),
            ]
        )

        if index % 2 == 0:

            table_styles.append(
                (
                    "BACKGROUND",
                    (0, index),
                    (4, index),
                    LIGHT_GRAY,
                )
            )

    report_table = Table(
        table_data,
        colWidths=[
            13 * mm,
            35 * mm,
            27 * mm,
            38 * mm,
            25 * mm,
            25 * mm,
            60 * mm,
            57 * mm,
        ],
        repeatRows=1,
    )

    report_table.setStyle(
        TableStyle(table_styles)
    )

    body.append(report_table)

    body.append(
        Spacer(
            1,
            12 * mm,
        )
    )

    signature = Table(
        [
            [
                "____________________________",
            ],
            [
                "Colliery Engineer / Mine Manager",
            ],
        ],
        colWidths=[70 * mm],
    )

    signature.setStyle(
        TableStyle(
            [
                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER",
                ),
                (
                    "FONTNAME",
                    (0, 1),
                    (-1, 1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 1),
                    (-1, 1),
                    8,
                ),
            ]
        )
    )

    body.append(
        Table(
            [["", signature]],
            colWidths=[
                170 * mm,
                80 * mm,
            ],
        )
    )

    doc.build(
        body,
        onFirstPage=add_page_number,
        onLaterPages=add_page_number,
    )

    pdf = buffer.getvalue()

    buffer.close()

    return pdf


# ============================================================
# GENERATE MONTHLY PDF
# ============================================================

def generate_monthly_pdf(
    queryset,
    month_str,
):

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=12 * mm,
        leftMargin=12 * mm,
        topMargin=12 * mm,
        bottomMargin=18 * mm,
        title="Monthly Machinery Inspection Summary",
        author="NIRIKSHAN",
    )

    styles = get_pdf_styles()

    cell_style = styles["PDFSmall"]

    cell_style_center = styles["PDFSmallCenter"]

    body = []

    body.append(
        create_report_header(
            "Monthly Machinery Inspection Summary",
            styles,
        )
    )

    body.append(
        Spacer(
            1,
            4 * mm,
        )
    )

    # --------------------------------------------------------
    # MONTH FORMAT
    # --------------------------------------------------------

    try:

        dt = datetime.strptime(
            month_str,
            "%Y-%m",
        )

        formatted_month = dt.strftime(
            "%B %Y"
        )

    except (ValueError, TypeError):

        formatted_month = str(
            month_str
        )

    # --------------------------------------------------------
    # DEDUPLICATE + UNFIT COUNT
    # --------------------------------------------------------

    unique_inspections = {}

    unfit_counts = {}

    for item in queryset:

        vehicle_no = (
            item.vehicle.machine_number
            if item.vehicle
            else "Unknown"
        )

        is_unfit = (
            str(
                item.operational_status
                or ""
            ).lower()
            in [
                "fail",
                "unfit",
            ]
        )

        if is_unfit:

            unfit_counts[
                vehicle_no
            ] = (
                unfit_counts.get(
                    vehicle_no,
                    0,
                )
                + 1
            )

        if (
            vehicle_no not in unique_inspections
            or item.id
            > unique_inspections[vehicle_no].id
        ):

            unique_inspections[
                vehicle_no
            ] = item

    final_queryset = sorted(
        unique_inspections.values(),
        key=lambda x: x.id,
    )

    # --------------------------------------------------------
    # META
    # --------------------------------------------------------

    meta_data = [
        [
            "Report Type",
            "Monthly Summary",
            "Month",
            formatted_month,
        ],
        [
            "Project",
            "Talaipalli",
            "Active Vehicles",
            str(len(final_queryset)),
        ],
    ]

    meta_table = Table(
        meta_data,
        colWidths=[
            30 * mm,
            60 * mm,
            30 * mm,
            90 * mm,
        ],
    )

    meta_table.setStyle(
        TableStyle(
            [
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    BORDER,
                ),
                (
                    "BACKGROUND",
                    (0, 0),
                    (0, -1),
                    LIGHT_BLUE,
                ),
                (
                    "BACKGROUND",
                    (2, 0),
                    (2, -1),
                    LIGHT_BLUE,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (0, -1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTNAME",
                    (2, 0),
                    (2, -1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
            ]
        )
    )

    body.append(meta_table)

    body.append(
        Spacer(
            1,
            4 * mm,
        )
    )

    # --------------------------------------------------------
    # TABLE
    # --------------------------------------------------------

    table_data = [
        [
            "Sl. No.",
            "Vehicle No.",
            "Machinery Type",
            "Unfit Instances",
            "EOM Status",
            "Latest Flagged Defects",
            "Remarks",
        ]
    ]

    table_styles = [
        (
            "GRID",
            (0, 0),
            (-1, -1),
            0.5,
            BORDER,
        ),
        (
            "BACKGROUND",
            (0, 0),
            (-1, 0),
            NAVY,
        ),
        (
            "TEXTCOLOR",
            (0, 0),
            (-1, 0),
            WHITE,
        ),
        (
            "FONTNAME",
            (0, 0),
            (-1, 0),
            "Helvetica-Bold",
        ),
        (
            "FONTSIZE",
            (0, 0),
            (-1, 0),
            7.5,
        ),
        (
            "ALIGN",
            (0, 0),
            (-1, -1),
            "CENTER",
        ),
        (
            "VALIGN",
            (0, 0),
            (-1, -1),
            "MIDDLE",
        ),
        (
            "TOPPADDING",
            (0, 0),
            (-1, -1),
            5,
        ),
        (
            "BOTTOMPADDING",
            (0, 0),
            (-1, -1),
            5,
        ),
    ]

    for index, item in enumerate(
        final_queryset,
        start=1,
    ):

        op_status = str(
            item.operational_status or ""
        )

        is_fit = is_fit_status(
            op_status
        )

        status = status_text(
            op_status
        )

        status_color, status_bg = status_style(
            op_status
        )

        vehicle_no = (
            item.vehicle.machine_number
            if item.vehicle
            else "Unknown"
        )

        unfit_count = (
            unfit_counts.get(
                vehicle_no,
                0,
            )
        )

        failed_items = [
            res.inspection_field.field_name
            for res in item.results.all()
            if str(res.result or "").lower()
            == "fail"
        ]

        failed_text = (
            ", ".join(failed_items)
            if failed_items
            else "-"
        )

        remarks_text = (
            item.remarks
            if item.remarks
            else (
                "Operational"
                if is_fit
                else "Requires maintenance"
            )
        )

        table_data.append(
            [
                str(index),
                Paragraph(
                    vehicle_no,
                    cell_style_center,
                ),
                Paragraph(
                    item.vehicle.machinery_type.name
                    if item.vehicle
                    and item.vehicle.machinery_type
                    else "",
                    cell_style_center,
                ),
                str(unfit_count),
                status,
                Paragraph(
                    failed_text,
                    cell_style,
                ),
                Paragraph(
                    remarks_text,
                    cell_style,
                ),
            ]
        )

        table_styles.extend(
            [
                (
                    "TEXTCOLOR",
                    (3, index),
                    (3, index),
                    RED
                    if unfit_count > 0
                    else GRAY,
                ),
                (
                    "BACKGROUND",
                    (3, index),
                    (3, index),
                    LIGHT_RED
                    if unfit_count > 0
                    else LIGHT_GRAY,
                ),
                (
                    "FONTNAME",
                    (3, index),
                    (3, index),
                    "Helvetica-Bold",
                ),
                (
                    "TEXTCOLOR",
                    (4, index),
                    (4, index),
                    status_color,
                ),
                (
                    "BACKGROUND",
                    (4, index),
                    (4, index),
                    status_bg,
                ),
                (
                    "FONTNAME",
                    (4, index),
                    (4, index),
                    "Helvetica-Bold",
                ),
            ]
        )

        if index % 2 == 0:

            table_styles.append(
                (
                    "BACKGROUND",
                    (0, index),
                    (2, index),
                    LIGHT_GRAY,
                )
            )

    report_table = Table(
        table_data,
        colWidths=[
            13 * mm,
            35 * mm,
            42 * mm,
            30 * mm,
            28 * mm,
            68 * mm,
            64 * mm,
        ],
        repeatRows=1,
    )

    report_table.setStyle(
        TableStyle(table_styles)
    )

    body.append(report_table)

    body.append(
        Spacer(
            1,
            12 * mm,
        )
    )

    signature = Table(
        [
            [
                "____________________________",
            ],
            [
                "Colliery Engineer / Mine Manager",
            ],
        ],
        colWidths=[70 * mm],
    )

    signature.setStyle(
        TableStyle(
            [
                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER",
                ),
                (
                    "FONTNAME",
                    (0, 1),
                    (-1, 1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 1),
                    (-1, 1),
                    8,
                ),
            ]
        )
    )

    body.append(
        Table(
            [["", signature]],
            colWidths=[
                170 * mm,
                80 * mm,
            ],
        )
    )

    doc.build(
        body,
        onFirstPage=add_page_number,
        onLaterPages=add_page_number,
    )

    pdf = buffer.getvalue()

    buffer.close()

    return pdf