import os
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Image,
    Paragraph,
    Spacer,
    SimpleDocTemplate,
    Table,
    TableStyle,
)

from inspections.models import InspectionResult


def generate_inspection_pdf(inspection):

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=30,
    )

    styles = getSampleStyleSheet()

    title_style = styles["Heading1"]
    title_style.alignment = TA_CENTER
    title_style.textColor = colors.HexColor("#163A8A")

    section_style = styles["Heading2"]
    section_style.alignment = TA_CENTER

    body_style = styles["BodyText"]

    BASE_DIR = os.path.dirname(__file__)

    ntpc_logo = os.path.join(
        BASE_DIR,
        "assets",
        "ntpc_logo.png",
    )

    nml_logo = os.path.join(
        BASE_DIR,
        "assets",
        "nml_logo.png",
    )

    body = []

    # -------------------------------------------------
    # HEADER
    # -------------------------------------------------

    header_text = """
    <para align="center">

    <font size="22" color="#163A8A">
    <b>NTPC MINING LIMITED</b>
    </font>

    <br/>

    <font size="12">
    (A Subsidiary of NTPC Limited)
    </font>

    <br/><br/>

    <font size="16">
    <b>Talaipalli Coal Mining Project</b>
    </font>

    <br/><br/>

    <font size="15">
    Machinery Safety Inspection Report
    </font>

    </para>
    """

    left_logo = (
        Image(ntpc_logo, width=80, height=65)
        if os.path.exists(ntpc_logo)
        else ""
    )

    right_logo = (
        Image(nml_logo, width=80, height=65)
        if os.path.exists(nml_logo)
        else ""
    )

    header = Table(
        [
            [
                left_logo,
                Paragraph(header_text, body_style),
                right_logo,
            ]
        ],
        colWidths=[90, 330, 90],
    )

    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 15),
            ]
        )
    )

    body.append(header)
    body.append(Spacer(1, 0.30 * inch))

    # -------------------------------------------------
    # INSPECTION INFORMATION
    # -------------------------------------------------

    body.append(
        Paragraph(
            "<b>Inspection Information</b>",
            section_style,
        )
    )

    body.append(Spacer(1, 0.10 * inch))

    info = [

        [
            "Inspection No",
            inspection.inspection_number,
            "Inspection Date",
            str(inspection.inspection_date),
        ],

        [
            "Engineer",
            inspection.engineer.full_name if inspection.engineer else "",
            "Designation",
            inspection.engineer.designation if inspection.engineer else "",
        ],

        [
            "Vehicle",
            inspection.vehicle.machine_number if inspection.vehicle else "",
            "Machinery",
            inspection.vehicle.machinery_type.name
            if inspection.vehicle and inspection.vehicle.machinery_type
            else "",
        ],

        [
            "Shift",
            inspection.shift,
            "Relay",
            inspection.relay,
        ],

        [
            "Status",
            inspection.operational_status,
            "",
            "",
        ],

    ]

    info_table = Table(
        info,
        colWidths=[100, 170, 100, 170],
    )

    info_table.setStyle(
        TableStyle(
            [

                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),

                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EAF2FF")),

                ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#EAF2FF")),

                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),

                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),

            ]
        )
    )

    body.append(info_table)
    body.append(Spacer(1, 0.30 * inch))

    # -------------------------------------------------
    # CHECKLIST
    # -------------------------------------------------

    body.append(
        Paragraph(
            "<b>Inspection Checklist</b>",
            section_style,
        )
    )

    body.append(Spacer(1, 0.10 * inch))

    checklist = [

        [
            "Sl No",
            "Inspection Item",
            "Result",
        ]

    ]

    results = InspectionResult.objects.filter(
        inspection=inspection
    ).select_related("inspection_field")

    for index, item in enumerate(results, start=1):

        checklist.append(

            [

                str(index),

                item.inspection_field.field_name,

                item.result,

            ]

        )

    checklist_table = Table(
        checklist,
        colWidths=[50, 340, 120],
    )

    checklist_table.setStyle(
        TableStyle(
            [

                ("GRID", (0, 0), (-1, -1), 0.5, colors.black),

                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#163A8A")),

                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),

                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),

                ("BOTTOMPADDING", (0, 0), (-1, 0), 10),

            ]
        )
    )

    body.append(checklist_table)
    body.append(Spacer(1, 0.30 * inch))

    # -------------------------------------------------
    # REMARKS
    # -------------------------------------------------

    body.append(
        Paragraph(
            "<b>Remarks</b>",
            section_style,
        )
    )

    body.append(Spacer(1, 0.10 * inch))

    body.append(
        Paragraph(
            inspection.remarks if inspection.remarks else "Nil",
            body_style,
        )
    )

    body.append(Spacer(1, 0.50 * inch))

    # -------------------------------------------------
    # SIGNATURES
    # -------------------------------------------------

    sign_table = Table(

        [

            [
                "____________________",
                "____________________",
            ],

            [
                "Inspection Engineer",
                "Supervisor",
            ],

        ],

        colWidths=[250, 250],

    )

    sign_table.setStyle(

        TableStyle(

            [

                ("ALIGN", (0, 0), (-1, -1), "CENTER"),

                ("TOPPADDING", (0, 1), (-1, 1), 10),

            ]

        )

    )

    body.append(sign_table)

    # -------------------------------------------------
    # BUILD PDF
    # -------------------------------------------------

    doc.build(body)

    pdf = buffer.getvalue()

    buffer.close()

    return pdf