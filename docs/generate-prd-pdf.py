from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

OUTPUT = Path(r"C:\Users\AndreiOkon(Zoracom-N\Desktop\vts-client\visitor-flow-prd.pdf")

text = """PRD: Minimal Visitor Flow Pages for MVP

Objective
Build the smallest set of pages needed to support the visitor journey shown in the flow:
Host creates appointment → invitation issued → confirmation → approval → arrival check-in → active visit → sign-out/completion.

This is not a full visitor management suite. It is the minimal path required to make the workflow usable and believable.

1. Product Goal
Enable a host to schedule a visit, send a visitor invitation, allow the visitor to confirm and arrive, and let reception/security check the visitor in and out. The system should reflect real status changes through the lifecycle without requiring extra modules.

2. In Scope
Core user roles
- Host
- Visitor
- Security / Reception

Required pages
1. Host creates appointment
2. Visitor invitation / confirmation
3. Visitor check-in page
4. Security / reception dashboard
5. Visit summary / completion page

3. Out of Scope for this PRD
- Full admin panel
- Bulk visitor import
- Advanced reporting
- Role-based permissions beyond the three roles above
- Notifications beyond basic status updates
- Multi-tenant configuration
- Deep analytics or audit history

4. User Flows
Flow A: Host schedules a visit
- Host opens appointment page
- Enters visitor information, date, time, purpose, host, and any notes
- Saves the appointment
- System creates a visit record in Pending status
- System generates an invitation for the visitor

Flow B: Visitor accepts the visit
- Visitor opens invitation link
- Sees who invited them, when, and why
- Confirms attendance
- System marks visit as Confirmed
- Host is notified

Flow C: Visitor arrives
- Visitor goes to check-in counter or kiosk
- Security or reception verifies identity
- System marks status as Checked In
- Visitor session becomes active

Flow D: Visit ends
- Visitor exits site
- Security / reception records sign-out
- System marks visit as Completed or Signed Off
- Visit record becomes historical

Alternate branch
- Visitor ignores or declines invitation
- Host or security rejects the request
- Visit status becomes Rejected

5. Page Requirements
Page 1: Host Appointment Creation
Purpose: Create the initial visit request.

Fields:
- Visitor name
- Visitor email
- Visitor phone
- Host name
- Visit date
- Visit time
- Purpose
- Optional notes
- Location or area

Actions:
- Create appointment
- Save draft
- Cancel

Behavior:
- New visits default to Pending
- Validation required for core fields
- After save, user sees confirmation and a generated invitation link or status summary

Success states:
- “Appointment created”
- Visit entry appears with status Pending

Page 2: Visitor Invitation / Confirmation
Purpose: Let the visitor confirm the scheduled visit.

Content:
- Host name
- Date and time
- Purpose
- Location
- Confirmation CTA

Actions:
- Confirm visit
- Decline visit

Behavior:
- If confirmed, status moves to Confirmed
- If declined, status moves to Rejected
- If no action is taken, status remains Pending

Success states:
- Confirmation message
- “Your visit is confirmed”
- Alternative “Your visit has been declined”

Page 3: Visitor Check-In Page
Purpose: Allow on-site check-in.

Content:
- Visitor profile
- Scheduled visit details
- Confirm arrival
- Identity verification area
- Optional check-in notes

Actions:
- Check in
- Cancel

Behavior:
- Only valid for approved or confirmed visits
- Once checked in, visit status becomes Checked In / Signed In
- Visitor is now active in the system

Success states:
- “Visitor checked in successfully”
- Active visit record displayed

Page 4: Security / Reception Dashboard
Purpose: Support operational oversight and check-in/out actions.

Sections:
- Pending visits
- Confirmed today
- Checked-in visitors
- Completed visits
- Rejected visits

Actions:
- Approve / reject visitor request
- Check in visitor
- Check out visitor
- View details

Behavior:
- Dashboard updates as statuses change
- Quick actions are prioritized for real-time staff use

Success states:
- Staff can identify expected visitors and current on-site visitors clearly

Page 5: Visit Summary / Completion Page
Purpose: Close out the visit and store the final outcome.

Content:
- Visitor name
- Host
- Time window
- Status history
- Check-in and sign-out time
- Final notes

Actions:
- Mark as completed
- View visit details
- Return to dashboard

Behavior:
- Final status is Completed or Signed Off
- Visit becomes read-only after sign-out

Success states:
- Final state visible with timestamps

6. Functional Requirements
Shared requirements
- All visits must have a single lifecycle status
- Status transitions must be clear and chronological
- Each page must show the current state of the visit
- Validation must prevent impossible transitions

Status model
We should support at minimum:
- Pending
- Confirmed
- Rejected
- Checked In
- Completed

If the product prefers the app’s existing terminology, this can map to:
- Pending
- Approved / Confirmed
- Signed In
- Signed Off
- Rejected

7. Acceptance Criteria
Appointment creation
- A host can create a visit with required fields
- The record is stored with Pending status
- A confirmation or invitation is generated

Visitor confirmation
- A visitor can confirm or decline
- System status updates correctly
- Host receives updated status

Check-in flow
- A confirmed visitor can be checked in
- Status changes to Checked In
- The attendance time is recorded

Completion flow
- A checked-in visitor can be signed out
- Status changes to Completed
- The final state remains visible in the record

Security dashboard
- Reception can view all visits by status
- Staff can act on the relevant flow without navigating into unrelated admin sections

8. MVP Success Metrics
- 90% of guest visit flows complete without a dead end
- Host can create an appointment in under 2 minutes
- Visitor can confirm in under 1 minute
- Staff can check in a visitor in under 30 seconds

9. Risks and Open Questions
- Should “Confirmed” and “Approved” be the same state or distinct states?
- Should sign-out happen automatically when visitor leaves, or manually by staff?
- Is the visitor invitation delivered by email, link, QR, or both?
- Should the reception dashboard be a dedicated page or a section on a broader host dashboard?

10. Recommended MVP Page Set
To keep the implementation focused, the best minimal set is:
1. Host appointment page
2. Visitor confirmation page
3. Reception check-in page
4. Visit summary / completion page

If you want a fifth page for operational clarity, add:
5. Security dashboard overview

That gives the product enough structure to feel complete without expanding into unrelated admin or reporting features.

Recommendation
Keep the first build to the visitor lifecycle only. Do not build a full admin shell or broad dashboard yet. The core value is the status progression and the actions tied to each step.
"""


def wrap_text(c, text, x, y, max_width, line_height):
    lines = []
    for paragraph in text.split('\n\n'):
        for line in paragraph.split('\n'):
            if not line.strip():
                lines.append('')
                continue
            words = line.split()
            current = ''
            for word in words:
                candidate = f'{current} {word}'.strip()
                if c.stringWidth(candidate, 'Helvetica', 10) <= max_width:
                    current = candidate
                else:
                    if current:
                        lines.append(current)
                    current = word
            if current:
                lines.append(current)
        lines.append('')
    return lines

page_w, page_h = A4
c = canvas.Canvas(str(OUTPUT), pagesize=A4)
margin = 54
x = margin
y = page_h - margin
max_width = page_w - margin * 2
line_height = 14

c.setTitle('Visitor Flow PRD')
c.setAuthor('VTS Client')

header = ['Visitor Flow Requirements', 'PRD · Minimal Visitor Flow MVP']
for idx, line in enumerate(header):
    c.setFont('Helvetica-Bold', 20 if idx == 0 else 11)
    c.drawString(x, y, line)
    y -= 28 if idx == 0 else 18

for paragraph in text.split('\n\n'):
    lines = wrap_text(c, paragraph, x, y, max_width, line_height)
    for line in lines:
        if y < 48:
            c.showPage()
            y = page_h - margin
        if line == '':
            y -= line_height
            continue
        c.setFont('Helvetica', 10)
        c.drawString(x, y, line)
        y -= line_height
    y -= 6

c.save()
print(f'Created PDF: {OUTPUT}')
