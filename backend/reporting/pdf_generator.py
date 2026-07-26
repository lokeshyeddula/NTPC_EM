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

    # --- PATH LOGIC ---
    CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
    FRONTEND_ASSETS_DIR = os.path.abspath(
        os.path.join(CURRENT_DIR, "..", "..", "frontend", "src", "assets")
    )

    ntpc_logo = os.path.join(FRONTEND_ASSETS_DIR, "Ntpc_logo.png")
    nml_logo = os.path.join(FRONTEND_ASSETS_DIR, "nml_logo.png")
    # --------------------------

    body = []

    # -------------------------------------------------
    # HEADER
    # -------------------------------------------------

    header_text = """
    <para align="center">
    <font size="22" color="#163A8A"><b>NTPC MINING LIMITED</b></font><br/>
    <font size="12">(A Subsidiary of NTPC Limited)</font><br/><br/>
    <font size="16"><b>Talaipalli Coal Mining Project</b></font><br/><br/>
    <font size="15">Machinery Safety Inspection Report</font>
    </para>
    """

    left_logo = Image(ntpc_logo, width=80, height=65) if os.path.exists(ntpc_logo) else ""
    right_logo = Image(nml_logo, width=80, height=65) if os.path.exists(nml_logo) else ""

    header = Table(
        [[left_logo, Paragraph(header_text, body_style), right_logo]],
        colWidths=[90, 330, 90],
    )

    header.setStyle(
        TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 15),
        ])
    )

    body.append(header)
    body.append(Spacer(1, 0.30 * inch))

    # -------------------------------------------------
    # INSPECTION INFORMATION
    # -------------------------------------------------
    body.append(Paragraph("<b>Inspection Information</b>", section_style))
    body.append(Spacer(1, 0.10 * inch))

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
            inspection.vehicle.machinery_type.name if inspection.vehicle and inspection.vehicle.machinery_type else "",
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

    info_table = Table(info, colWidths=[100, 170, 100, 170])

    info_styles = [
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EAF2FF")),
        ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#EAF2FF")),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]

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
    body.append(Paragraph("<b>Inspection Checklist</b>", section_style))
    body.append(Spacer(1, 0.10 * inch))

    checklist = [["Sl. No.", "Inspection Item", "Result"]]

    results = InspectionResult.objects.filter(inspection=inspection).select_related("inspection_field")

    checklist_styles = [
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#163A8A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
    ]

    for index, item in enumerate(results, start=1):
        result_val = str(item.result or "")
        checklist.append([str(index), item.inspection_field.field_name, result_val])

        if result_val.lower() in ["pass", "fit"]:
            checklist_styles.append(("TEXTCOLOR", (2, index), (2, index), colors.green))
            checklist_styles.append(("FONTNAME", (2, index), (2, index), "Helvetica-Bold"))
        elif result_val.lower() in ["fail", "unfit"]:
            checklist_styles.append(("TEXTCOLOR", (2, index), (2, index), colors.red))
            checklist_styles.append(("FONTNAME", (2, index), (2, index), "Helvetica-Bold"))

    checklist_table = Table(checklist, colWidths=[50, 340, 120])
    checklist_table.setStyle(TableStyle(checklist_styles))

    body.append(checklist_table)
    body.append(Spacer(1, 0.30 * inch))

    # -------------------------------------------------
    # REMARKS & SIGNATURES
    # -------------------------------------------------
    body.append(Paragraph("<b>Remarks</b>", section_style))
    body.append(Spacer(1, 0.10 * inch))
    body.append(Paragraph(inspection.remarks if inspection.remarks else "Nil", body_style))
    body.append(Spacer(1, 0.50 * inch))

    sign_table = Table(
        [["____________________", "____________________"], ["Inspection Engineer", "Supervisor"]],
        colWidths=[250, 250],
    )
    sign_table.setStyle(TableStyle([("ALIGN", (0, 0), (-1, -1), "CENTER"), ("TOPPADDING", (0, 1), (-1, 1), 10)]))

    body.append(sign_table)
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

    # Left-aligned style for text blobs
    cell_style = styles["BodyText"]
    cell_style.fontSize = 9
    cell_style.leading = 11

    # Centered style for IDs/Names
    cell_style_center = styles["Normal"]
    cell_style_center.fontSize = 9
    cell_style_center.leading = 11
    cell_style_center.alignment = TA_CENTER

    CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
    FRONTEND_ASSETS_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "frontend", "src", "assets"))
    ntpc_logo = os.path.join(FRONTEND_ASSETS_DIR, "Ntpc_logo.png")
    nml_logo = os.path.join(FRONTEND_ASSETS_DIR, "nml_logo.png")

    body = []

    header_text = """
    <para align="center">
    <font size="20" color="#163A8A"><b>NTPC MINING LIMITED</b></font><br/>
    <font size="11">(A Subsidiary of NTPC Limited)</font><br/><br/>
    <font size="14"><b>Talaipalli Coal Mining Project</b></font><br/><br/>
    <font size="14">Machinery Safety Inspection Report</font>
    </para>
    """

    left_logo = Image(ntpc_logo, width=80, height=65) if os.path.exists(ntpc_logo) else ""
    right_logo = Image(nml_logo, width=80, height=65) if os.path.exists(nml_logo) else ""

    header = Table([[left_logo, Paragraph(header_text, styles["BodyText"]), right_logo]], colWidths=[90, 360, 90])
    header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                                ("BOTTOMPADDING", (0, 0), (-1, -1), 10)]))
    body.append(header)
    body.append(Spacer(1, 0.2 * inch))

    meta_data = [
        ["Report Type:", "Shift-wise Inspection Report", "Date:", date_str],
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

    unique_inspections = {}
    for item in queryset:
        vehicle_no = item.vehicle.machine_number if item.vehicle else "Unknown"
        if vehicle_no not in unique_inspections or item.id > unique_inspections[vehicle_no].id:
            unique_inspections[vehicle_no] = item

    final_queryset = sorted(unique_inspections.values(), key=lambda x: x.id)

    # Added \n to force stacking and prevent overlapping text
    table_data = [
        ["Sl.\nNo.", "Engineer", "Vehicle\nNo.", "Machinery\nType", "Status", "Flagged\nDefects", "Remarks"]
    ]

    table_styles = [
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#163A8A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),  # Slightly smaller header font
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ]

    for index, item in enumerate(final_queryset, start=1):
        op_status = str(item.operational_status or "").title()
        is_fit = op_status.lower() in ["pass", "fit"]

        status_text = "Fit" if is_fit else "Unfit"
        table_styles.append(("TEXTCOLOR", (4, index), (4, index), colors.green if is_fit else colors.red))
        table_styles.append(("FONTNAME", (4, index), (4, index), "Helvetica-Bold"))

        failed_items_list = [res.inspection_field.field_name for res in item.results.all() if
                             str(res.result).lower() == "fail"]
        failed_text = ", ".join(failed_items_list) if failed_items_list else "-"
        remarks_text = item.remarks if item.remarks else (
            "Fit for operations" if is_fit else "Unfit for operations pls repair it")

        table_data.append([
            str(index),
            Paragraph(item.engineer.full_name if item.engineer else "", cell_style),
            Paragraph(item.vehicle.machine_number if item.vehicle else "", cell_style_center),
            Paragraph(item.vehicle.machinery_type.name if item.vehicle and item.vehicle.machinery_type else "",
                      cell_style_center),
            status_text,
            Paragraph(failed_text, cell_style),
            Paragraph(remarks_text, cell_style),
        ])

    # Rebalanced column widths
    report_table = Table(table_data, colWidths=[35, 90, 65, 80, 50, 115, 120])
    report_table.setStyle(TableStyle(table_styles))
    body.append(report_table)
    body.append(Spacer(1, 0.4 * inch))

    summary_data = [["______________________________"], ["Shift In-charge / Engineer"]]
    summary_table = Table(summary_data, colWidths=[200])
    summary_table.setStyle(TableStyle([("ALIGN", (0, 0), (-1, -1), "RIGHT"), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                                       ("TOPPADDING", (0, 1), (-1, 1), 5)]))

    layout_table = Table([["", summary_table]], colWidths=[350, 200])
    body.append(layout_table)

    doc.build(body)
    pdf = buffer.getvalue()
    buffer.close()

    return pdf


# -------------------------------------------------
# GENERATE DAILY PDF
# -------------------------------------------------

def generate_daily_pdf(queryset, date_str):
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        rightMargin=20,
        leftMargin=20,
        topMargin=30,
        bottomMargin=30,
    )

    styles = getSampleStyleSheet()

    # Left-aligned style for text blobs
    cell_style = styles["BodyText"]
    cell_style.fontSize = 9
    cell_style.leading = 11

    # Centered style for IDs/Names
    cell_style_center = styles["Normal"]
    cell_style_center.fontSize = 9
    cell_style_center.leading = 11
    cell_style_center.alignment = TA_CENTER

    CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
    FRONTEND_ASSETS_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "frontend", "src", "assets"))
    ntpc_logo = os.path.join(FRONTEND_ASSETS_DIR, "Ntpc_logo.png")
    nml_logo = os.path.join(FRONTEND_ASSETS_DIR, "nml_logo.png")

    body = []

    header_text = """
    <para align="center">
    <font size="20" color="#163A8A"><b>NTPC MINING LIMITED</b></font><br/>
    <font size="11">(A Subsidiary of NTPC Limited)</font><br/><br/>
    <font size="14"><b>Talaipalli Coal Mining Project</b></font><br/><br/>
    <font size="14">Daily Random Inspection Report</font>
    </para>
    """

    left_logo = Image(ntpc_logo, width=80, height=65) if os.path.exists(ntpc_logo) else ""
    right_logo = Image(nml_logo, width=80, height=65) if os.path.exists(nml_logo) else ""

    header = Table([[left_logo, Paragraph(header_text, styles["BodyText"]), right_logo]], colWidths=[90, 360, 90])
    header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                                ("BOTTOMPADDING", (0, 0), (-1, -1), 10)]))
    body.append(header)
    body.append(Spacer(1, 0.2 * inch))

    unique_inspections = {}
    for item in queryset:
        vehicle_no = item.vehicle.machine_number if item.vehicle else "Unknown"
        if vehicle_no not in unique_inspections or item.id > unique_inspections[vehicle_no].id:
            unique_inspections[vehicle_no] = item

    final_queryset = sorted(unique_inspections.values(), key=lambda x: x.id)

    meta_data = [
        ["Report Type:", "Daily Inspection Report", "Date:", date_str],
        ["Project:", "Talaipalli", "Total Vehicles:", f"{len(final_queryset)}"],
    ]

    meta_table = Table(meta_data, colWidths=[90, 180, 90, 180])
    meta_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F9FAFB")),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    body.append(meta_table)
    body.append(Spacer(1, 0.2 * inch))

    # Added \n to force stacking and prevent overlapping text
    table_data = [
        ["Sl.\nNo.", "Engineer", "Vehicle\nNo.", "Machinery\nType", "Last\nShift", "EOD\nStatus", "Flagged\nDefects",
         "Remarks"]
    ]

    table_styles = [
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#163A8A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),  # Slightly smaller header font
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ]

    for index, item in enumerate(final_queryset, start=1):
        op_status = str(item.operational_status or "").title()
        is_fit = op_status.lower() in ["pass", "fit"]

        status_text = "Fit" if is_fit else "Unfit"
        table_styles.append(("TEXTCOLOR", (5, index), (5, index), colors.green if is_fit else colors.red))
        table_styles.append(("FONTNAME", (5, index), (5, index), "Helvetica-Bold"))

        failed_items_list = [res.inspection_field.field_name for res in item.results.all() if
                             str(res.result).lower() == "fail"]
        failed_text = ", ".join(failed_items_list) if failed_items_list else "-"

        remarks_text = item.remarks if item.remarks else (
            "Fit for operations" if is_fit else "Unfit for operations pls repair it")

        # Paragraph wrappers force long words/names to wrap downwards instead of bleeding
        table_data.append([
            str(index),
            Paragraph(item.engineer.full_name if item.engineer else "", cell_style),
            Paragraph(item.vehicle.machine_number if item.vehicle else "", cell_style_center),
            Paragraph(item.vehicle.machinery_type.name if item.vehicle and item.vehicle.machinery_type else "",
                      cell_style_center),
            Paragraph(item.shift, cell_style_center),
            status_text,
            Paragraph(failed_text, cell_style),
            Paragraph(remarks_text, cell_style),
        ])

    # Rebalanced column widths to total 555 max available width
    report_table = Table(table_data, colWidths=[30, 75, 60, 75, 55, 55, 105, 100])
    report_table.setStyle(TableStyle(table_styles))
    body.append(report_table)
    body.append(Spacer(1, 0.4 * inch))

    summary_data = [["______________________________"], ["Colliery Engineer / Mine Manager"]]
    summary_table = Table(summary_data, colWidths=[200])
    summary_table.setStyle(TableStyle([("ALIGN", (0, 0), (-1, -1), "RIGHT"), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                                       ("TOPPADDING", (0, 1), (-1, 1), 5)]))

    layout_table = Table([["", summary_table]], colWidths=[350, 200])
    body.append(layout_table)

    doc.build(body)
    pdf = buffer.getvalue()
    buffer.close()

    return pdf


# -------------------------------------------------
# GENERATE MONTHLY PDF
# -------------------------------------------------

def generate_monthly_pdf(queryset, month_str):
    from io import BytesIO
    from reportlab.lib import colors
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
    from reportlab.lib.styles import getSampleStyleSheet
    import os
    from datetime import datetime

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, rightMargin=20, leftMargin=20, topMargin=30, bottomMargin=30
    )

    styles = getSampleStyleSheet()
    cell_style = styles["BodyText"]
    cell_style.fontSize = 9
    cell_style.leading = 11

    cell_style_center = styles["Normal"]
    cell_style_center.fontSize = 9
    cell_style_center.leading = 11
    cell_style_center.alignment = TA_CENTER

    CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
    FRONTEND_ASSETS_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "frontend", "src", "assets"))
    ntpc_logo = os.path.join(FRONTEND_ASSETS_DIR, "Ntpc_logo.png")
    nml_logo = os.path.join(FRONTEND_ASSETS_DIR, "nml_logo.png")

    body = []

    header_text = """
    <para align="center">
    <font size="20" color="#163A8A"><b>NTPC MINING LIMITED</b></font><br/>
    <font size="11">(A Subsidiary of NTPC Limited)</font><br/><br/>
    <font size="14"><b>Talaipalli Coal Mining Project</b></font><br/><br/>
    <font size="14">Monthly Inspection Summary</font>
    </para>
    """

    left_logo = Image(ntpc_logo, width=80, height=65) if os.path.exists(ntpc_logo) else ""
    right_logo = Image(nml_logo, width=80, height=65) if os.path.exists(nml_logo) else ""

    header = Table([[left_logo, Paragraph(header_text, styles["BodyText"]), right_logo]], colWidths=[90, 360, 90])
    header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                                ("BOTTOMPADDING", (0, 0), (-1, -1), 10)]))
    body.append(header)
    body.append(Spacer(1, 0.2 * inch))

    # Format Date (e.g., "2026-07" to "July 2026")
    try:
        dt = datetime.strptime(month_str, "%Y-%m")
        formatted_month = dt.strftime("%B %Y")
    except ValueError:
        formatted_month = month_str

    # DEDUPLICATE VEHICLES & COUNT UNFIT INSTANCES
    unique_inspections = {}
    unfit_counts = {}

    for item in queryset:
        vehicle_no = item.vehicle.machine_number if item.vehicle else "Unknown"

        # Increment unfit count if the machine failed
        is_unfit = str(item.operational_status or "").lower() in ["fail", "unfit"]
        if is_unfit:
            unfit_counts[vehicle_no] = unfit_counts.get(vehicle_no, 0) + 1

        if vehicle_no not in unique_inspections or item.id > unique_inspections[vehicle_no].id:
            unique_inspections[vehicle_no] = item

    final_queryset = sorted(unique_inspections.values(), key=lambda x: x.id)

    meta_data = [
        ["Report Type:", "Monthly Summary", "Month:", formatted_month],
        ["Project:", "Talaipalli", "Active Vehicles:", f"{len(final_queryset)}"],
    ]

    meta_table = Table(meta_data, colWidths=[90, 180, 90, 180])
    meta_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F9FAFB")),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    body.append(meta_table)
    body.append(Spacer(1, 0.2 * inch))

    table_data = [
        ["Sl.\nNo.", "Vehicle\nNo.", "Machinery\nType", "Unfit\nInstances", "EOM\nStatus", "Latest Flagged\nDefects",
         "Remarks"]
    ]

    table_styles = [
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#163A8A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ]

    for index, item in enumerate(final_queryset, start=1):
        op_status = str(item.operational_status or "").title()
        is_fit = op_status.lower() in ["pass", "fit"]
        vehicle_no = item.vehicle.machine_number if item.vehicle else "Unknown"

        status_text = "Fit" if is_fit else "Unfit"
        table_styles.append(("TEXTCOLOR", (4, index), (4, index), colors.green if is_fit else colors.red))
        table_styles.append(("FONTNAME", (4, index), (4, index), "Helvetica-Bold"))

        # Add red background logic for Unfit Instances
        unfit_count = unfit_counts.get(vehicle_no, 0)
        if unfit_count > 0:
            table_styles.append(("BACKGROUND", (3, index), (3, index), colors.HexColor("#FEF2F2")))  # Red-50
            table_styles.append(("TEXTCOLOR", (3, index), (3, index), colors.HexColor("#DC2626")))  # Red-600
        else:
            table_styles.append(("TEXTCOLOR", (3, index), (3, index), colors.HexColor("#374151")))  # Gray-700

        table_styles.append(("FONTNAME", (3, index), (3, index), "Helvetica-Bold"))

        failed_items_list = [res.inspection_field.field_name for res in item.results.all() if
                             str(res.result).lower() == "fail"]
        failed_text = ", ".join(failed_items_list) if failed_items_list else "-"

        remarks_text = item.remarks if item.remarks else ("Operational" if is_fit else "Requires maintenance")

        table_data.append([
            str(index),
            Paragraph(vehicle_no, cell_style_center),
            Paragraph(item.vehicle.machinery_type.name if item.vehicle and item.vehicle.machinery_type else "",
                      cell_style_center),
            str(unfit_count),
            status_text,
            Paragraph(failed_text, cell_style),
            Paragraph(remarks_text, cell_style),
        ])

    # Rebalanced column widths
    report_table = Table(table_data, colWidths=[30, 75, 80, 65, 55, 140, 110])
    report_table.setStyle(TableStyle(table_styles))
    body.append(report_table)
    body.append(Spacer(1, 0.4 * inch))

    summary_data = [["______________________________"], ["Colliery Engineer / Mine Manager"]]
    summary_table = Table(summary_data, colWidths=[200])
    summary_table.setStyle(TableStyle([("ALIGN", (0, 0), (-1, -1), "RIGHT"), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                                       ("TOPPADDING", (0, 1), (-1, 1), 5)]))

    layout_table = Table([["", summary_table]], colWidths=[350, 200])
    body.append(layout_table)

    doc.build(body)
    pdf = buffer.getvalue()
    buffer.close()

    return pdf