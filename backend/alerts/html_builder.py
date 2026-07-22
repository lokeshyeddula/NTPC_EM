from typing import List


def build_machinery_failure_email(
    inspection_no: str,
    machine_name: str,
    door_no: str,
    relay: str,
    engineer: str,
    failed_items: List[str],
    remarks: str,
):
    failed_rows = ""

    for item in failed_items:
        failed_rows += f"""
        <tr>
            <td style="padding:8px;border:1px solid #ddd;">
                ❌ {item}
            </td>
        </tr>
        """

    return f"""
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
</head>

<body style="font-family:Arial;background:#f4f4f4;padding:30px;">

<div style="max-width:800px;background:white;margin:auto;border-radius:10px;overflow:hidden;">

<div style="background:#0070C0;color:white;padding:20px;">
<h2>NTPC LIMITED</h2>
<h3>Talaipalli Coal Mining Project</h3>
<h2>Industrial Machinery Inspection Alert</h2>
</div>

<div style="padding:25px;">

<table style="width:100%;border-collapse:collapse;">

<tr>
<td><b>Inspection No</b></td>
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

<h3 style="color:red;">Failed Inspection Items</h3>

<table style="width:100%;border-collapse:collapse;">
{failed_rows}
</table>

<br>

<h3>Remarks</h3>

<p>{remarks}</p>

<hr>

<p>
This is an automatically generated email from
<b>NTPC E&M Inspection System</b>.
</p>

</div>

</div>

</body>

</html>
"""