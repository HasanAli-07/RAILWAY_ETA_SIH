import sys, pypdf

sys.stdout.reconfigure(encoding='utf-8')

def read_pdf(filename):
    print(f"\n==================== READING {filename} ====================")
    reader = pypdf.PdfReader(filename)
    full_text = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        full_text.append(f"--- PAGE {i+1} ---\n" + text)

    combined = "\n".join(full_text)
    print(combined[:4000])

    # Save to a text file for inspection
    txt_filename = filename.replace('.pdf', '.txt').replace(' ', '_').replace('...', '')
    with open(txt_filename, 'w', encoding='utf-8') as out:
        out.write(combined)
    print(f"Saved full extracted text to {txt_filename}")

read_pdf('Dynamic Train ETA Prediction (1).pdf')
read_pdf('Ohk now create a DETAILED SRS DOCUMENT FOR THIS P... (1).pdf')
read_pdf('UIUX Specification._1. the minimal professional o....pdf')
