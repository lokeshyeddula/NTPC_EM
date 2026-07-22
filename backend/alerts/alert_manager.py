from alerts.email_service import email_service
from alerts.html_builder import build_machinery_failure_email
from alerts.recipients import MACHINERY_ALERT_RECIPIENTS


def send_machinery_failure_alert(inspection):
    """
    Sends an email alert if any inspection item has failed.
    """

    failed_items = []

    for result in inspection.results.all():

        if result.result == "Fail":

            failed_items.append(
                result.inspection_field.field_name
            )

    # No failures → no email
    if not failed_items:
        return

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
        subject=f"🚨 Machinery Inspection FAILED - {inspection.vehicle.machine_number}",
        body=html,
        recipients=MACHINERY_ALERT_RECIPIENTS,
        is_html=True,
    )