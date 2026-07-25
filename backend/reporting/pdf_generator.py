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

    # Ensure status is a string and handle None values safely
    op_status = str(inspection.operational_status or "")

    info = [
        [
            "Inspection No.",
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
            "Vehicle No.",
            inspection.vehicle.machine_number if inspection.vehicle else "",
            "Machinery Type",
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
            op_status,
            "",
            "",
        ],
    ]

    info_table = Table(
        info,
        colWidths=[100, 170, 100, 170],
    )

    # Base styles for Info Table
    info_styles = [
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EAF2FF")),
        ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#EAF2FF")),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]

    # Dynamically color the Status text (Row 4, Column 1) for FIT/PASS and UNFIT/FAIL
    if op_status.lower() in ["pass", "fit"]:
        info_styles.append(("TEXTCOLOR", (1, 4), (1, 4), colors.green))
        info_styles.append(("FONTNAME", (1, 4), (1, 4), "Helvetica-Bold"))
    elif op_status.lower() in ["fail", "unfit"]:
        info_styles.append(("TEXTCOLOR", (1, 4), (1, 4), colors.red))
        info_styles.append(("FONTNAME", (1, 4), (1, 4), "Helvetica-Bold"))

    info_table.setStyle(TableStyle(info_styles))

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
            "Sl. No.",
            "Inspection Item",
            "Result",
        ]
    ]

    results = InspectionResult.objects.filter(
        inspection=inspection
    ).select_related("inspection_field")

    # Base styles for Checklist Table
    checklist_styles = [
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#163A8A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
    ]

    for index, item in enumerate(results, start=1):

        result_val = str(item.result or "")

        checklist.append(
            [
                str(index),
                item.inspection_field.field_name,
                result_val,
            ]
        )

        # Dynamically color the Result text (Column 2, Current Row)
        if result_val.lower() in ["pass", "fit"]:
            checklist_styles.append(("TEXTCOLOR", (2, index), (2, index), colors.green))
            checklist_styles.append(("FONTNAME", (2, index), (2, index), "Helvetica-Bold"))
        elif result_val.lower() in ["fail", "unfit"]:
            checklist_styles.append(("TEXTCOLOR", (2, index), (2, index), colors.red))
            checklist_styles.append(("FONTNAME", (2, index), (2, index), "Helvetica-Bold"))

    checklist_table = Table(
        checklist,
        colWidths=[50, 340, 120],
    )

    checklist_table.setStyle(TableStyle(checklist_styles))

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


# -------------------------------------------------
# GENERATE SHIFT PDF
# -------------------------------------------------


def generate_shift_pdf(queryset, date_str, shift_str):
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        rightMargin=20,
        leftMargin=20,
        topMargin=30,
        bottomMargin=30,
    )

    styles = getSampleStyleSheet()

    body_style = styles["BodyText"]

    # Custom smaller style for table wrapping
    cell_style = styles["Normal"]
    cell_style.fontSize = 9
    cell_style.leading = 11

    BASE_DIR = os.path.dirname(__file__)
    ntpc_logo = os.path.join(BASE_DIR, "assets", "ntpc_logo.png")
    nml_logo = os.path.join(BASE_DIR, "assets", "nml_logo.png")

    body = []

    # -------------------------------------------------
    # HEADER
    # -------------------------------------------------
    header_text = """
    <para align="center">
    <font size="20" color="#163A8A"><b>NTPC MINING LIMITED</b></font><br/>
    <font size="11">(A Subsidiary of NTPC Limited)</font><br/><br/>
    <font size="14"><b>Talaipalli Coal Mining Project</b></font><br/><br/>
    <font size="14">Random Inspection Report</font>
    </para>
    """

    left_logo = Image(ntpc_logo, width=80, height=65) if os.path.exists(ntpc_logo) else ""
    right_logo = Image(nml_logo, width=80, height=65) if os.path.exists(nml_logo) else ""

    header = Table(
        [[left_logo, Paragraph(header_text, body_style), right_logo]],
        colWidths=[90, 360, 90],
    )
    header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    body.append(header)
    body.append(Spacer(1, 0.2 * inch))

    # -------------------------------------------------
    # META INFORMATION
    # -------------------------------------------------
    meta_data = [
        ["Report Type:", "ShiftWise", "Date:", date_str],
        ["Project:", "Talaipalli", "Shift:", f"{shift_str} Shift"],
    ]

    meta_table = Table(meta_data, colWidths=[80, 190, 80, 190])
    meta_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F9FAFB")),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    body.append(meta_table)
    body.append(Spacer(1, 0.2 * inch))

    # -------------------------------------------------
    # DEDUPLICATE VEHICLES (Keep Latest Inspection)
    # -------------------------------------------------
    unique_inspections = {}
    for item in queryset:
        vehicle_no = item.vehicle.machine_number if item.vehicle else "Unknown"
        # If vehicle not in dict, or if current item has a higher ID (newer), update it.
        if vehicle_no not in unique_inspections or item.id > unique_inspections[vehicle_no].id:
            unique_inspections[vehicle_no] = item

    # Sort the final list by ID to maintain chronological order
    final_queryset = sorted(unique_inspections.values(), key=lambda x: x.id)

    # -------------------------------------------------
    # MAIN REPORT TABLE
    # -------------------------------------------------
    table_data = [
        ["Sl. No.", "Engineer", "Vehicle No.", "Machinery Type", "Status", "Flagged Defects", "Remarks"]
    ]

    # Table styling initialization
    table_styles = [
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#163A8A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ]

    for index, item in enumerate(final_queryset, start=1):
        # Determine Status
        op_status = str(item.operational_status or "").title()
        is_fit = op_status.lower() in ["pass", "fit"]

        if is_fit:
            status_text = "Fit"
            table_styles.append(("TEXTCOLOR", (4, index), (4, index), colors.green))
        else:
            status_text = "Unfit"
            table_styles.append(("TEXTCOLOR", (4, index), (4, index), colors.red))

        table_styles.append(("FONTNAME", (4, index), (4, index), "Helvetica-Bold"))

        # Extract Failed Items
        failed_items_list = [
            res.inspection_field.field_name
            for res in item.results.all()
            if str(res.result).lower() == "fail"
        ]
        failed_text = ", ".join(failed_items_list) if failed_items_list else "-"

        remarks_text = item.remarks if item.remarks else (
            "Fit for operations" if is_fit else "Unfit for operations pls repair it")

        # Append row (wrap text fields in Paragraph to support multiline wrapping)
        table_data.append([
            str(index),
            Paragraph(item.engineer.full_name if item.engineer else "", cell_style),
            item.vehicle.machine_number if item.vehicle else "",
            item.vehicle.machinery_type.name if item.vehicle and item.vehicle.machinery_type else "",
            status_text,
            Paragraph(failed_text, cell_style),
            Paragraph(remarks_text, cell_style),
        ])

    # Column Widths optimized for A4 width (approx 550 points usable)
    report_table = Table(table_data, colWidths=[35, 90, 65, 75, 55, 120, 110])
    report_table.setStyle(TableStyle(table_styles))

    body.append(report_table)
    body.append(Spacer(1, 0.4 * inch))

    # -------------------------------------------------
    # FOOTER / SIGNATURES
    # -------------------------------------------------
    summary_data = [
        ["______________________________"],
        ["Shift In-charge / Engineer"]
    ]

    summary_table = Table(summary_data, colWidths=[200])
    summary_table.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 1), (-1, 1), 5),
    ]))

    # Wrap in a larger table to push it to the right
    layout_table = Table([["", summary_table]], colWidths=[350, 200])
    body.append(layout_table)

    # Build PDF
    doc.build(body)
    pdf = buffer.getvalue()
    buffer.close()

    return pdf