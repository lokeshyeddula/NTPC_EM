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

</head>

<body style="margin:0;padding:30px;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">

<tr>

<td align="center">

<table
width="800"
cellpadding="0"
cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;
box-shadow:0 2px 10px rgba(0,0,0,0.10);">

<tr>

<td style="background:#005BAC;color:white;padding:25px;">

<h1 style="margin:0;font-size:30px;">
NTPC LIMITED
</h1>

<p style="margin-top:8px;font-size:18px;">
Talaipalli Coal Mining Project
</p>

<h2 style="margin-top:25px;">
{title}
</h2>

</td>

</tr>

<tr>

<td style="padding:30px;">

{body}

</td>

</tr>

<tr>

<td
style="padding:20px;
font-size:13px;
color:#666;
border-top:1px solid #ddd;">

This is an automatically generated email from
<b>NTPC E&M Inspection System</b>.

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
<td style="padding:10px;border:1px solid #dddddd;">
❌ {item}
</td>
</tr>
"""

    body = f"""

<table width="100%" cellspacing="0" cellpadding="8">

<tr>

<td width="35%"><b>Inspection No</b></td>

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

<h3 style="color:#d60000;">
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

<h3>Remarks</h3>

<div
style="
background:#fff8e6;
border-left:5px solid orange;
padding:12px;
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

<table width="100%" cellspacing="0" cellpadding="8">

<tr>

<td width="35%"><b>Inspection No</b></td>

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
<span
style="
color:red;
font-weight:bold;
font-size:16px;
">
{operator_checklist}
</span>
</td>

</tr>

</table>

<br>

<h3 style="color:#d60000;">
Remarks
</h3>

<div
style="
background:#ffecec;
border-left:5px solid red;
padding:12px;
">

{remarks}

</div>

"""

    return email_wrapper(
        "Operator Behaviour Alert",
        body,
    )