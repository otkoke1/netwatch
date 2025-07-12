from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO
from datetime import datetime

def generate_lan_report(user_data, network_info, devices, speed_test):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    # Title and Header
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30
    )
    elements.append(Paragraph("LAN Network Report", title_style))
    elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles["Normal"]))
    elements.append(Paragraph(f"Generated for: {user_data['username']}", styles["Normal"]))
    elements.append(Spacer(1, 20))

    # Network Information Section
    elements.append(Paragraph("Network Information", styles["Heading2"]))
    network_data = [
        ["Subnet", network_info.get("subnet", "N/A")],
        ["Local IP", network_info.get("local_ip", "N/A")],
        ["Gateway IP", network_info.get("gateway_ip", "N/A")]
    ]

    network_table = Table(network_data, colWidths=[200, 300])
    network_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.grey),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(network_table)
    elements.append(Spacer(1, 20))

    # Speed Test Section
    elements.append(Paragraph("Internet Speed Test Results", styles["Heading2"]))
    speed_data = [
        ["Download Speed", f"{speed_test.get('download', 'N/A')} Mbps"],
        ["Upload Speed", f"{speed_test.get('upload', 'N/A')} Mbps"],
        ["Ping", f"{speed_test.get('ping', 'N/A')} ms"]
    ]
    speed_table = Table(speed_data, colWidths=[200, 300])
    speed_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.grey),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(speed_table)
    elements.append(Spacer(1, 20))

    # Connected Devices Section
    elements.append(Paragraph("Connected Devices Summary", styles["Heading2"]))
    elements.append(Paragraph(f"Total Devices Found: {len(devices)}", styles["Normal"]))
    elements.append(Paragraph(f"Scan Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles["Normal"]))
    elements.append(Spacer(1, 10))

    if devices:
        device_data = [["IP Address", "MAC Address", "Hostname", "Vendor"]]
        for device in devices:
            device_data.append([
                device.get("ip", "N/A"),
                device.get("mac", "N/A"),
                device.get("hostname", "N/A"),
                device.get("vendor", "N/A")
            ])

        device_table = Table(device_data, colWidths=[100, 120, 140, 140])
        device_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        elements.append(device_table)
    else:
        elements.append(Paragraph("No devices found", styles["Normal"]))

    try:
        doc.build(elements)
        buffer.seek(0)
        return buffer
    except Exception as e:
        print(f"Error building PDF: {str(e)}")
        raise