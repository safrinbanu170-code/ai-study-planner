from flask import Flask, render_template, request
from datetime import datetime, timedelta

app = Flask(__name__)

# Temporary storage (college project level)
data = {}

# ---------- HELPER FUNCTION ----------
# Round study time to nearest 15 minutes (ex: 3.2 hrs -> 3 hrs 15 min)
def round_to_15_minutes(hours):
    total_minutes = hours * 60
    rounded_minutes = round(total_minutes / 15) * 15

    hrs = rounded_minutes // 60
    mins = rounded_minutes % 60

    if mins == 0:
        return f"{int(hrs)} hrs"
    else:
        return f"{int(hrs)} hrs {int(mins)} min"


# ------------------ STUDENT & EXAM DETAILS ------------------
@app.route("/", methods=["GET", "POST"])
def student_exam():
    if request.method == "POST":
        data["name"] = request.form["name"]
        data["exam_date"] = request.form["exam_date"]
        data["hours"] = int(request.form["hours"])
        return render_template("subject_units.html")

    return render_template("student_exam.html")


# ------------------ SUBJECT & UNITS ------------------
@app.route("/subject", methods=["POST"])
def subject_units():
    data["subject"] = request.form["subject"]
    units = request.form.getlist("units")
    data["unitCount"] = len(units)

    return render_template("priority_level.html")


# ------------------ PRIORITY + AI LOGIC ------------------
@app.route("/priority", methods=["POST"])
def priority_level():
    difficulty = request.form["difficulty"]

    name = data["name"]
    subject = data["subject"]
    hours = data["hours"]
    unitCount = data["unitCount"]

    exam_date = datetime.strptime(data["exam_date"], "%Y-%m-%d")
    today = datetime.today().replace(hour=0, minute=0, second=0, microsecond=0)

    # ---------- TOTAL AVAILABLE DAYS ----------
    total_days = (exam_date - today).days
    if total_days <= 0:
        total_days = 1

    # ---------- AI DAILY TIME LOGIC ----------
    if difficulty == "Hard":
        per_day_time = hours * 1.2
    elif difficulty == "Medium":
        per_day_time = hours
    else:
        per_day_time = hours * 0.8

    # Avoid overload
    if per_day_time > 6:
        per_day_time = 6

    # ---------- SCORE PREDICTION ----------
    if unitCount == 5 and hours >= 4:
        score = "65 - 75"
    elif unitCount >= 3:
        score = "45 - 60"
    else:
        score = "25 - 35"

    timetable = []
    current_date = today

    # ---------- 🔥 CORE DISTRIBUTION LOGIC ----------
    if total_days >= unitCount:
        # Case 1: Days >= Units (spread one unit across multiple days)
        days_per_unit = total_days // unitCount
        if days_per_unit == 0:
            days_per_unit = 1

        for unit in range(1, unitCount + 1):
            for _ in range(days_per_unit):
                if current_date >= exam_date:
                    break

                timetable.append({
                    "date": current_date.strftime("%d-%m-%Y"),
                    "unit": f"Unit {unit}",
                    "time": round_to_15_minutes(per_day_time)
                })

                current_date += timedelta(days=1)

    else:
        # Case 2: Days < Units (multiple units per day)
        units_per_day = unitCount // total_days
        extra_units = unitCount % total_days
        unit_no = 1

        for _ in range(total_days):
            daily_units = units_per_day
            if extra_units > 0:
                daily_units += 1
                extra_units -= 1

            for _ in range(daily_units):
                if unit_no > unitCount:
                    break

                timetable.append({
                    "date": current_date.strftime("%d-%m-%Y"),
                    "unit": f"Unit {unit_no}",
                    "time": round_to_15_minutes(per_day_time / daily_units)
                })

                unit_no += 1

            current_date += timedelta(days=1)

    return render_template(
        "result.html",
        name=name,
        subject=subject,
        score=score,
        timetable=timetable
    )


# ------------------ RUN APP ------------------
if __name__ == "__main__":
    app.run(debug=True)


