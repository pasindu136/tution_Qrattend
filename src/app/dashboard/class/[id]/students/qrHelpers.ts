import QRCode from 'qrcode';
import jsPDF from 'jspdf';

export async function generateStudentQrCode(studentId: string): Promise<string> {
    try {
        const qrDataUrl = await QRCode.toDataURL(studentId, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
        return qrDataUrl;
    } catch (err) {
        console.error('Error generating QR', err);
        return '';
    }
}

export async function downloadSingleQr(studentId: string, studentName: string) {
    const qrDataUrl = await generateStudentQrCode(studentId);
    if (!qrDataUrl) return;

    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR_${studentName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export async function downloadAllQrsPdf(students: any[], className: string) {
    if (!students || students.length === 0) {
        alert('No students to generate QR codes for.');
        return;
    }

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Grid settings
    const cols = 3;
    const rows = 4; // 12 QRs per page
    const margin = 10; // Page margin
    const cellWidth = (pageWidth - 2 * margin) / cols;
    const cellHeight = (pageHeight - 2 * margin) / rows;
    const qrSize = Math.min(cellWidth, cellHeight) - 20; // 20mm padding for text

    let x = margin;
    let y = margin;
    let currentItem = 0;

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const qrDataUrl = await generateStudentQrCode(student.id);

        if (currentItem > 0 && currentItem % (cols * rows) === 0) {
            doc.addPage();
            x = margin;
            y = margin;
        }

        const col = (currentItem % (cols * rows)) % cols;
        const row = Math.floor((currentItem % (cols * rows)) / cols);

        const currentX = margin + col * cellWidth;
        const currentY = margin + row * cellHeight;

        // Add class name
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(className, currentX + cellWidth / 2, currentY + 5, { align: 'center' });

        // Add QR code
        const qrX = currentX + (cellWidth - qrSize) / 2;
        const qrY = currentY + 8;
        doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

        // Add student name
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        
        // Truncate name if too long
        let displayName = student.full_name;
        if (displayName.length > 20) displayName = displayName.substring(0, 17) + '...';
        
        doc.text(displayName, currentX + cellWidth / 2, qrY + qrSize + 5, { align: 'center' });
        
        // Add ID if available
        if (student.tute_id) {
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(student.tute_id, currentX + cellWidth / 2, qrY + qrSize + 9, { align: 'center' });
        }

        // Draw a light border around the cell for cutting reference
        doc.setDrawColor(200);
        doc.setLineWidth(0.1);
        doc.rect(currentX, currentY, cellWidth, cellHeight);

        currentItem++;
    }

    doc.save(`Class_${className.replace(/[^a-zA-Z0-9]/g, '_')}_QRs.pdf`);
}
