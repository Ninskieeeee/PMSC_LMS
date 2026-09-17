<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\Grade;
use App\Models\Payment;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin Cruz',
            'email' => 'admin@pmscclarin.edu.ph',
            'password' => 'Admin@12345',
            'role' => 'admin',
            'access_code' => 'ADM-00001',
        ]);

        $teacherOne = User::create([
            'name' => 'Maria Santos',
            'email' => 'teacher1@pmscclarin.edu.ph',
            'password' => 'Teacher@123',
            'role' => 'teacher',
            'access_code' => 'TCH-00001',
        ]);

        $teacherTwo = User::create([
            'name' => 'Jose Ramirez',
            'email' => 'teacher2@pmscclarin.edu.ph',
            'password' => User::generateTempPassword(),
            'role' => 'teacher',
            'access_code' => User::generateAccessCode('teacher'),
        ]);

        $teacherThree = User::create([
            'name' => 'Liza Fernandez',
            'email' => 'teacher3@pmscclarin.edu.ph',
            'password' => User::generateTempPassword(),
            'role' => 'teacher',
            'access_code' => User::generateAccessCode('teacher'),
        ]);

        $finance = User::create([
            'name' => 'Finance Reyes',
            'email' => 'finance@pmscclarin.edu.ph',
            'password' => 'Finance@123',
            'role' => 'finance',
            'access_code' => 'FIN-00001',
        ]);

        $ssg = User::create([
            'name' => 'SSG Officer Lopez',
            'email' => 'ssg@pmscclarin.edu.ph',
            'password' => 'Ssg@12345',
            'role' => 'ssg',
            'access_code' => 'SSG-00001',
        ]);

        $subjectsByLevel = [
            'Grade 3' => ['Filipino', 'English', 'Mathematics', 'Science', 'Araling Panlipunan'],
            'Grade 6' => ['Filipino', 'English', 'Mathematics', 'Science', 'Araling Panlipunan'],
            'Grade 7' => ['Filipino', 'English', 'Mathematics', 'Science', 'Araling Panlipunan', 'MAPEH', 'ESP'],
            'Grade 8' => ['Filipino', 'English', 'Mathematics', 'Science', 'Araling Panlipunan', 'MAPEH', 'ESP'],
            'Grade 9' => ['Filipino', 'English', 'Mathematics', 'Science', 'Araling Panlipunan', 'MAPEH', 'ESP'],
            'Grade 10' => ['Filipino', 'English', 'Mathematics', 'Science', 'Araling Panlipunan', 'MAPEH', 'ESP'],
            'Grade 11' => ['Oral Communication', 'General Mathematics', 'Earth Science', 'Personal Development', 'PE and Health'],
            'Grade 12' => ['Reading and Writing', 'Statistics and Probability', 'Physical Science', 'Practical Research', 'PE and Health'],
        ];

        $teacherPool = [$teacherOne->id, $teacherTwo->id, $teacherThree->id];

        // Weekly schedule per year level.
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        $times = ['7:30 AM - 8:30 AM', '8:30 AM - 9:30 AM', '9:45 AM - 10:45 AM', '10:45 AM - 11:45 AM', '1:00 PM - 2:00 PM'];

        foreach ($subjectsByLevel as $yearLevel => $subjects) {
            foreach ($days as $index => $day) {
                $subject = $subjects[$index % count($subjects)];

                Schedule::create([
                    'year_level' => $yearLevel,
                    'subject' => $subject,
                    'teacher_id' => $teacherPool[array_rand($teacherPool)],
                    'time' => $times[$index % count($times)],
                    'day' => $day,
                    'room' => 'Room '.random_int(101, 110),
                ]);
            }
        }

        $studentNames = [
            ['Grade 3', null, 'Angelo Bautista', 'Rosa Bautista'],
            ['Grade 3', null, 'Bea Villanueva', 'Marites Villanueva'],
            ['Grade 6', null, 'Carlo Mendoza', 'Fe Mendoza'],
            ['Grade 6', null, 'Diana Reyes', 'Nestor Reyes'],
            ['Grade 7', null, 'Ella Gonzales', 'Ana Gonzales'],
            ['Grade 7', null, 'Francis Aquino', 'Teodoro Aquino'],
            ['Grade 8', null, 'Grace Padilla', 'Corazon Padilla'],
            ['Grade 8', null, 'Harold Torres', 'Ruben Torres'],
            ['Grade 9', null, 'Ivy Salazar', 'Dolores Salazar'],
            ['Grade 9', null, 'Jerome Castillo', 'Wilfredo Castillo'],
            ['Grade 10', null, 'Kim Navarro', 'Susan Navarro'],
            ['Grade 10', null, 'Leo Domingo', 'Alberto Domingo'],
            ['Grade 11', 'HUMSS', 'Mia Espino', 'Josefina Espino'],
            ['Grade 11', 'HUMSS', 'Noel Ferrer', 'Bienvenido Ferrer'],
            ['Grade 11', 'HUMSS', 'Odessa Lim', 'Carmen Lim'],
            ['Grade 12', 'HUMSS', 'Paolo Ignacio', 'Manuel Ignacio'],
            ['Grade 12', 'HUMSS', 'Queenie Herrera', 'Remedios Herrera'],
        ];

        // First demo account keeps the documented STD-00001 code.
        $firstUser = User::create([
            'name' => $studentNames[0][2],
            'email' => null,
            'password' => 'Student@123',
            'role' => 'student',
            'access_code' => 'STD-00001',
        ]);

        $students = [Student::create([
            'user_id' => $firstUser->id,
            'year_level' => $studentNames[0][0],
            'strand' => $studentNames[0][1],
            'qr_code' => 'STD-00001',
            'address' => 'Poblacion, Clarin, Bohol',
            'guardian_name' => $studentNames[0][3],
            'guardian_contact' => '09'.random_int(100000000, 999999999),
            'date_enrolled' => now()->subYears(1)->startOfYear(),
        ])];

        foreach (array_slice($studentNames, 1) as [$yearLevel, $strand, $name, $guardian]) {
            $accessCode = User::generateAccessCode('student');

            $user = User::create([
                'name' => $name,
                'email' => null,
                'password' => 'Student@123',
                'role' => 'student',
                'access_code' => $accessCode,
            ]);

            $students[] = Student::create([
                'user_id' => $user->id,
                'year_level' => $yearLevel,
                'strand' => $strand,
                'qr_code' => $accessCode,
                'address' => 'Clarin, Bohol',
                'guardian_name' => $guardian,
                'guardian_contact' => '09'.random_int(100000000, 999999999),
                'date_enrolled' => now()->subYears(1)->startOfYear(),
            ]);
        }

        $quarters = ['1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter'];

        foreach ($students as $index => $student) {
            $subjects = $subjectsByLevel[$student->year_level];

            foreach ($subjects as $subject) {
                foreach ($quarters as $quarterIndex => $quarter) {
                    // Leave the last quarter open for a couple of students to simulate in-progress grading.
                    if ($quarterIndex === 3 && in_array($index, [1, 9], true)) {
                        continue;
                    }

                    Grade::create([
                        'student_id' => $student->id,
                        'teacher_id' => $teacherPool[array_rand($teacherPool)],
                        'subject' => $subject,
                        'quarter' => $quarter,
                        'grade' => random_int(70, 99),
                    ]);
                }
            }
        }

        $feesByLevel = [
            'Grade 3' => 10000, 'Grade 6' => 10000,
            'Grade 7' => 12000, 'Grade 8' => 12000, 'Grade 9' => 12000, 'Grade 10' => 12000,
            'Grade 11' => 15000, 'Grade 12' => 15000,
        ];

        foreach ($students as $index => $student) {
            $totalFee = $feesByLevel[$student->year_level];

            // Vary payment status: fully paid, partially paid, unpaid.
            $paidRatio = match (true) {
                $index % 5 === 0 => 1,
                $index % 5 === 1 => 0,
                default => random_int(30, 80) / 100,
            };

            if ($paidRatio > 0) {
                Payment::create([
                    'student_id' => $student->id,
                    'amount_paid' => round($totalFee * $paidRatio, 2),
                    'total_fee' => $totalFee,
                    'recorded_by' => $finance->id,
                    'notes' => $paidRatio >= 1 ? 'Full payment' : 'Partial payment',
                    'date' => now()->subMonths(random_int(0, 3))->toDateString(),
                ]);
            } else {
                // Record the fee obligation with zero paid so balances still show correctly.
                Payment::create([
                    'student_id' => $student->id,
                    'amount_paid' => 0,
                    'total_fee' => $totalFee,
                    'recorded_by' => $finance->id,
                    'notes' => 'Assessment posted',
                    'date' => now()->subMonths(2)->toDateString(),
                ]);
            }
        }

        $events = [
            ['name' => 'Foundation Day', 'description' => 'Annual founding anniversary celebration.', 'date' => now()->subMonths(2)->toDateString()],
            ['name' => 'Intramurals', 'description' => 'School-wide sports competition.', 'date' => now()->subMonth()->toDateString()],
            ['name' => "Teachers' Day", 'description' => 'Appreciation program for the faculty.', 'date' => now()->subWeeks(2)->toDateString()],
            ['name' => 'Career Fair', 'description' => 'Guidance and career orientation for senior high students.', 'date' => now()->addWeeks(2)->toDateString()],
            ['name' => 'Recognition Day', 'description' => 'End-of-year awarding ceremony.', 'date' => now()->addMonths(2)->toDateString()],
        ];

        $createdEvents = [];

        foreach ($events as $eventData) {
            $createdEvents[] = Event::create([
                ...$eventData,
                'created_by' => $ssg->id,
            ]);
        }

        // Attendance for the two events that already happened.
        foreach (array_slice($createdEvents, 0, 3) as $eventIndex => $event) {
            foreach ($students as $studentIndex => $student) {
                // Skip a few students per event so attendance isn't uniformly 100%.
                if (($studentIndex + $eventIndex) % 4 === 0) {
                    continue;
                }

                EventAttendance::create([
                    'event_id' => $event->id,
                    'student_id' => $student->id,
                    'scanned_at' => now()->subMonths(2)->addDays($eventIndex),
                ]);
            }
        }

        $this->command?->info('Seeded demo accounts:');
        $this->command?->table(['Role', 'Access Code', 'Password'], [
            ['Admin', $admin->access_code, 'Admin@12345'],
            ['Teacher', $teacherOne->access_code, 'Teacher@123'],
            ['Finance', $finance->access_code, 'Finance@123'],
            ['SSG', $ssg->access_code, 'Ssg@12345'],
            ['Student/Parent', $firstUser->access_code, 'Student@123'],
        ]);
    }
}
