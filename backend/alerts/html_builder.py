from typing import List


# ============================================================
# Common Email Wrapper
# ============================================================

def email_wrapper(title: str, body: str):

    return f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<!-- Required for mobile responsiveness in email clients -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

<!-- Outer table wrapper with 100% width and padding that works on both mobile and desktop -->
<table width="100%" cellpadding="0" cellspacing="0" style="padding: 15px;">
<tr>
<td align="center">

<!-- Inner table with max-width for desktop, and 100% width for mobile -->
<table
cellpadding="0"
cellspacing="0"
style="width:100%; max-width:800px; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.10); margin:0 auto;">

<tr>
<td style="background:#005BAC;color:white;padding:25px;">
<h1 style="margin:0;font-size:26px;">
NTPC LIMITED
</h1>
<p style="margin-top:8px;font-size:16px;">
Talaipalli Coal Mining Project
</p>
<h2 style="margin-top:25px;font-size:20px;">
{title}
</h2>
</td>
</tr>

<tr>
<td style="padding:20px 25px;">
{body}
</td>
</tr>

<tr>
<td
style="padding:20px 25px;
font-size:13px;
color:#666;
border-top:1px solid #ddd;">
This is an automatically generated email from <b>NTPC E&M Inspection System</b>.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
"""


# ============================================================
# Machinery Failure Email
# ============================================================

def build_machinery_failure_email(
    inspection_no: str,
    machine_name: str,
    door_no: str,
    relay: str,
    engineer: str,
    failed_items: List[str],
    remarks: str,
):

    rows = ""
    for item in failed_items:
        rows += f"""
<tr>
<td style="padding:10px;border:1px solid #dddddd;font-size:15px;line-height:1.5;">
❌ {item}
</td>
</tr>
"""

    body = f"""
<!-- Use min-width on the left column to prevent text wrapping weirdly on mobile -->
<table width="100%" cellspacing="0" cellpadding="8" style="font-size:15px;line-height:1.5;">
<tr>
<td style="min-width:120px;width:35%;"><b>Inspection No</b></td>
<td>{inspection_no}</td>
</tr>
<tr>
<td><b>Machine</b></td>
<td>{machine_name}</td>
</tr>
<tr>
<td><b>Door Number</b></td>
<td>{door_no}</td>
</tr>
<tr>
<td><b>Relay</b></td>
<td>{relay}</td>
</tr>
<tr>
<td><b>Engineer</b></td>
<td>{engineer}</td>
</tr>
</table>

<br>

<h3 style="color:#d60000;margin-bottom:10px;">
Failed Inspection Items
</h3>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="border-collapse:collapse;">
{rows}
</table>

<br>

<h3 style="margin-bottom:10px;">Remarks</h3>

<div
style="
background:#fff8e6;
border-left:5px solid orange;
padding:15px;
font-size:15px;
line-height:1.5;
">
{remarks}
</div>
"""

    return email_wrapper(
        "Random Inspection Alert",
        body,
    )


# ============================================================
# Operator Behaviour Alert
# ============================================================

def build_operator_behaviour_email(
    inspection_no: str,
    machine_name: str,
    door_no: str,
    operator_name: str,
    employee_id: str,
    agency: str,
    mobile: str,
    engineer: str,
    operator_checklist: str,
    remarks: str,
):

    if not remarks:
        remarks = (
            "Operator has not filled the mandatory "
            "pre-start operator checklist."
        )

    body = f"""
<table width="100%" cellspacing="0" cellpadding="8" style="font-size:15px;line-height:1.5;">
<tr>
<td style="min-width:120px;width:35%;"><b>Inspection No</b></td>
<td>{inspection_no}</td>
</tr>
<tr>
<td><b>Machine</b></td>
<td>{machine_name}</td>
</tr>
<tr>
<td><b>Door Number</b></td>
<td>{door_no}</td>
</tr>
<tr>
<td><b>Operator Name</b></td>
<td>{operator_name}</td>
</tr>
<tr>
<td><b>Employee ID</b></td>
<td>{employee_id}</td>
</tr>
<tr>
<td><b>Agency</b></td>
<td>{agency}</td>
</tr>
<tr>
<td><b>Mobile</b></td>
<td>{mobile}</td>
</tr>
<tr>
<td><b>Engineer</b></td>
<td>{engineer}</td>
</tr>
<tr>
<td><b>Operator Checklist Filled</b></td>
<td>
<span style="color:red;font-weight:bold;font-size:16px;">
{operator_checklist}
</span>
</td>
</tr>
</table>

<br>

<h3 style="color:#d60000;margin-bottom:10px;">
Remarks
</h3>

<div
style="
background:#ffecec;
border-left:5px solid red;
padding:15px;
font-size:15px;
line-height:1.5;
">
{remarks}
</div>
"""

    return email_wrapper(
        "Operator Behaviour Alert",
        body,
    )