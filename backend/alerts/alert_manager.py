from reporting.pdf_generator import generate_inspection_pdf

from alerts.email_service import email_service
from alerts.html_builder import (
    build_machinery_failure_email,
    build_operator_behaviour_email,
)
from alerts.recipients import (
    MACHINERY_ALERT_RECIPIENTS,
    OPERATOR_ALERT_RECIPIENTS,
)


# ==========================================================
# MAIN ALERT ENGINE
# ==========================================================

def process_alerts(inspection):
    """
    Main Alert Engine

    Every inspection passes through this function.

    It evaluates all alert rules and sends only
    the required emails.
    """

    send_machinery_failure_alert(
        inspection,
    )

    send_operator_behaviour_alert(
        inspection,
    )


# ==========================================================
# MACHINERY FAILURE ALERT
# ==========================================================

def send_machinery_failure_alert(
    inspection,
):

    failed_items = []

    for result in inspection.results.all():

        if result.result == "Fail":

            failed_items.append(
                result.inspection_field.field_name
            )

    # No failed items -> No machinery alert
    if len(failed_items) == 0:
        return

    # Generate PDF only when required
    pdf = generate_inspection_pdf(
        inspection
    )

    html = build_machinery_failure_email(
        inspection_no=inspection.inspection_number,
        machine_name=inspection.vehicle.make_model,
        door_no=inspection.vehicle.machine_number,
        relay=inspection.relay,
        engineer=inspection.engineer.full_name,
        failed_items=failed_items,
        remarks=inspection.remarks or "No Remarks",
    )

    email_service.send_email(
        subject=f"NTPC E&M | Random Inspection | {inspection.vehicle.machine_number} | {inspection.inspection_number}",
        body=html,
        recipients=MACHINERY_ALERT_RECIPIENTS,
        is_html=True,
        attachment=pdf,
        attachment_name=f"{inspection.inspection_number}.pdf",
    )


# ==========================================================
# OPERATOR BEHAVIOUR ALERT
# ==========================================================

def send_operator_behaviour_alert(
    inspection,
):

    print("=" * 60)
    print("Operator Checklist :", inspection.operator_checklist_filled)
    print("Type :", type(inspection.operator_checklist_filled))
    print("=" * 60)

    # If checklist was filled, no alert
    if inspection.operator_checklist_filled:
        return

    remarks = (
        inspection.operator_remarks
        if inspection.operator_remarks
        else "Operator has not filled the mandatory pre-start operator checklist."
    )

    html = build_operator_behaviour_email(
        inspection_no=inspection.inspection_number,
        machine_name=inspection.vehicle.make_model,
        door_no=inspection.vehicle.machine_number,
        operator_name=inspection.operator_name,
        employee_id=inspection.operator_employee_id,
        agency=inspection.operator_agency,
        mobile=inspection.operator_mobile,
        engineer=inspection.engineer.full_name,
        operator_checklist="NO",
        remarks=remarks,
    )

    email_service.send_email(
        subject=f"NTPC E&M | Operator Behaviour Alert | - {inspection.vehicle.machine_number} | | {inspection.inspection_number}",
        body=html,
        recipients=OPERATOR_ALERT_RECIPIENTS,
        is_html=True,
    )