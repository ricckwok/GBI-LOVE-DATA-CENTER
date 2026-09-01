import {
  ChurchMember,
  Family,
  COOLGroup,
  ChildDedication,
  WaterBaptism,
  HolySpiritBaptism,
  MarriageRecord,
  DeathRecord,
  Worker,
  WorkerDepartment,
  WorshipType,
  WorshipService,
  AttendanceRecord,
  WATemplate,
  WAMessageLog,
  WASettings,
  ChurchSettings,
  User,
  ActivityLog,
  FamilyRelationLabels,
  MaritalStatusLabels
} from '../types';

export interface LaravelExportData {
  users: User[];
  churchSettings: ChurchSettings;
  members: ChurchMember[];
  families: Family[];
  coolGroups: COOLGroup[];
  childDedications: ChildDedication[];
  waterBaptisms: WaterBaptism[];
  holySpiritBaptisms: HolySpiritBaptism[];
  marriages: MarriageRecord[];
  deathRecords: DeathRecord[];
  workers: Worker[];
  workerDepartments: WorkerDepartment[];
  worshipServices: WorshipService[];
  worshipTypes: WorshipType[];
  attendanceRecords: AttendanceRecord[];
  waSettings: WASettings;
  waTemplates: WATemplate[];
  waLogs: WAMessageLog[];
  activityLogs: ActivityLog[];
}

function escapeSQL(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  const val = String(str);
  return val.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case "\0": return "\\0";
      case "\x08": return "\\b";
      case "\x09": return "\\t";
      case "\x1a": return "\\z";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\" + char;
      default:
        return char;
    }
  });
}

/**
 * Generate full MySQL / MariaDB / PostgreSQL SQL Dump with live data
 */
export function generateLaravelSQLDump(data: LaravelExportData): string {
  const dateStr = new Date().toISOString();
  let sql = `-- ==========================================================
-- GBI LOVE INHIL - DATABASE DUMP (LARAVEL / MYSQL COMPATIBLE)
-- Generated on: ${dateStr}
-- Synced from React Single Source of Truth
-- ==========================================================

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

-- --------------------------------------------------------
-- Table structure for \`users\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`username\` VARCHAR(100) NOT NULL UNIQUE,
  \`email\` VARCHAR(255) DEFAULT NULL,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('SUPER_ADMIN', 'ADMINISTRATOR', 'OPERATOR', 'PEMIMPIN_COOL') NOT NULL DEFAULT 'ADMINISTRATOR',
  \`avatar_url\` TEXT DEFAULT NULL,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`remember_token\` VARCHAR(100) DEFAULT NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`church_settings\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`church_settings\`;
CREATE TABLE \`church_settings\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`church_name\` VARCHAR(255) NOT NULL,
  \`synod\` VARCHAR(255) DEFAULT NULL,
  \`address\` TEXT DEFAULT NULL,
  \`city\` VARCHAR(100) DEFAULT NULL,
  \`province\` VARCHAR(100) DEFAULT NULL,
  \`postal_code\` VARCHAR(20) DEFAULT NULL,
  \`phone\` VARCHAR(50) DEFAULT NULL,
  \`email\` VARCHAR(150) DEFAULT NULL,
  \`senior_pastor\` VARCHAR(255) DEFAULT NULL,
  \`logo_url\` TEXT DEFAULT NULL,
  \`signature_url\` TEXT DEFAULT NULL,
  \`stamp_url\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`families\` (Kartu Keluarga Jemaat / KKJ)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`families\`;
CREATE TABLE \`families\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`family_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`kkj_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`head_member_id\` VARCHAR(50) DEFAULT NULL,
  \`head_name\` VARCHAR(255) NOT NULL,
  \`address\` TEXT DEFAULT NULL,
  \`district\` VARCHAR(100) DEFAULT NULL,
  \`city\` VARCHAR(100) DEFAULT NULL,
  \`postal_code\` VARCHAR(20) DEFAULT NULL,
  \`whatsapp_number\` VARCHAR(50) DEFAULT NULL,
  \`registered_date\` DATE DEFAULT NULL,
  \`status\` ENUM('AKTIF', 'PINDAH', 'NONAKTIF') NOT NULL DEFAULT 'AKTIF',
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`cool_groups\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`cool_groups\`;
CREATE TABLE \`cool_groups\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`cool_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`cool_name\` VARCHAR(255) NOT NULL,
  \`leader_member_id\` VARCHAR(50) DEFAULT NULL,
  \`leader_name\` VARCHAR(255) NOT NULL,
  \`vice_leader_name\` VARCHAR(255) DEFAULT NULL,
  \`schedule_day\` VARCHAR(50) DEFAULT NULL,
  \`schedule_time\` VARCHAR(50) DEFAULT NULL,
  \`location_address\` TEXT DEFAULT NULL,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`church_members\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`church_members\`;
CREATE TABLE \`church_members\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`member_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`family_id\` VARCHAR(50) DEFAULT NULL,
  \`family_relation\` INT DEFAULT 1,
  \`full_name\` VARCHAR(255) NOT NULL,
  \`nickname\` VARCHAR(100) DEFAULT NULL,
  \`nik\` VARCHAR(50) DEFAULT NULL,
  \`gender\` ENUM('L', 'P') NOT NULL,
  \`birth_place\` VARCHAR(100) DEFAULT NULL,
  \`birth_date\` DATE NOT NULL,
  \`whatsapp_number\` VARCHAR(50) DEFAULT NULL,
  \`email\` VARCHAR(150) DEFAULT NULL,
  \`address\` TEXT DEFAULT NULL,
  \`city\` VARCHAR(100) DEFAULT NULL,
  \`district\` VARCHAR(100) DEFAULT NULL,
  \`occupation\` VARCHAR(150) DEFAULT NULL,
  \`marital_status\` INT DEFAULT 1,
  \`cool_id\` VARCHAR(50) DEFAULT NULL,
  \`member_status\` ENUM('AKTIF', 'TIDAK_AKTIF', 'PINDAH', 'MENINGGAL') NOT NULL DEFAULT 'AKTIF',
  \`joined_date\` DATE DEFAULT NULL,
  \`photo_url\` TEXT DEFAULT NULL,
  \`qr_token\` VARCHAR(255) DEFAULT NULL,
  \`notes\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`family_id\`) REFERENCES \`families\`(\`id\`) ON DELETE SET NULL,
  FOREIGN KEY (\`cool_id\`) REFERENCES \`cool_groups\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`attendance_records\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`attendance_records\`;
CREATE TABLE \`attendance_records\` (
  \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`service_id\` VARCHAR(50) NOT NULL,
  \`member_id\` VARCHAR(50) NOT NULL,
  \`member_name\` VARCHAR(255) NOT NULL,
  \`check_in_time\` DATETIME NOT NULL,
  \`check_in_method\` ENUM('QR_SCAN', 'MANUAL_SEARCH', 'RFID_CARD', 'SELF_CHECKIN') NOT NULL DEFAULT 'QR_SCAN',
  \`verified_by\` VARCHAR(100) DEFAULT NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- INSERT LIVE DATA (DML)
-- ==========================================================
`;

  // Insert Users
  if (data.users && data.users.length > 0) {
    sql += `\n-- Dumping data for table \`users\`\nINSERT INTO \`users\` (\`id\`, \`name\`, \`username\`, \`email\`, \`password\`, \`role\`, \`avatar_url\`, \`is_active\`) VALUES\n`;
    const userRows = data.users.map(u => {
      const id = escapeSQL(u.id);
      const name = escapeSQL(u.fullName);
      const username = escapeSQL(u.username);
      const email = escapeSQL(u.email || '');
      const pass = escapeSQL(u.password || '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
      const role = escapeSQL(u.role);
      const avatar = escapeSQL(u.avatarUrl || '');
      const active = u.isActive ? 1 : 0;
      return `('${id}', '${name}', '${username}', '${email}', '${pass}', '${role}', '${avatar}', ${active})`;
    });
    sql += userRows.join(',\n') + ';\n';
  }

  // Insert Church Settings
  const cs = data.churchSettings;
  sql += `\n-- Dumping data for table \`church_settings\`\nINSERT INTO \`church_settings\` (\`church_name\`, \`synod\`, \`address\`, \`city\`, \`phone\`, \`email\`, \`senior_pastor\`) VALUES\n('${escapeSQL(cs.churchName)}', '${escapeSQL(cs.synod)}', '${escapeSQL(cs.address)}', '${escapeSQL(cs.city)}', '${escapeSQL(cs.phone)}', '${escapeSQL(cs.email)}', '${escapeSQL(cs.seniorPastor)}');\n`;

  // Insert Families
  if (data.families && data.families.length > 0) {
    sql += `\n-- Dumping data for table \`families\`\nINSERT INTO \`families\` (\`id\`, \`family_code\`, \`kkj_number\`, \`head_member_id\`, \`head_name\`, \`address\`, \`district\`, \`city\`, \`whatsapp_number\`, \`status\`, \`registered_date\`) VALUES\n`;
    const famRows = data.families.map(f => {
      return `('${escapeSQL(f.id)}', '${escapeSQL(f.familyCode)}', '${escapeSQL(f.kkjNumber)}', '${escapeSQL(f.headMemberId)}', '${escapeSQL(f.headName)}', '${escapeSQL(f.address)}', '${escapeSQL(f.district)}', '${escapeSQL(f.city)}', '${escapeSQL(f.whatsappNumber)}', '${escapeSQL(f.status)}', '${escapeSQL(f.registeredDate)}')`;
    });
    sql += famRows.join(',\n') + ';\n';
  }

  // Insert COOL Groups
  if (data.coolGroups && data.coolGroups.length > 0) {
    sql += `\n-- Dumping data for table \`cool_groups\`\nINSERT INTO \`cool_groups\` (\`id\`, \`cool_code\`, \`cool_name\`, \`leader_member_id\`, \`leader_name\`, \`vice_leader_name\`, \`schedule_day\`, \`schedule_time\`, \`location_address\`, \`is_active\`) VALUES\n`;
    const coolRows = data.coolGroups.map(c => {
      return `('${escapeSQL(c.id)}', '${escapeSQL(c.coolCode)}', '${escapeSQL(c.coolName)}', '${escapeSQL(c.leaderMemberId || '')}', '${escapeSQL(c.leaderName)}', '${escapeSQL(c.viceLeaderName || '')}', '${escapeSQL(c.scheduleDay || c.meetingDay || '')}', '${escapeSQL(c.scheduleTime || c.meetingTime || '')}', '${escapeSQL(c.locationAddress || c.meetingLocation || '')}', ${c.isActive ? 1 : 0})`;
    });
    sql += coolRows.join(',\n') + ';\n';
  }

  // Insert Church Members
  if (data.members && data.members.length > 0) {
    sql += `\n-- Dumping data for table \`church_members\`\nINSERT INTO \`church_members\` (\`id\`, \`member_number\`, \`family_id\`, \`family_relation\`, \`full_name\`, \`gender\`, \`birth_place\`, \`birth_date\`, \`whatsapp_number\`, \`address\`, \`city\`, \`district\`, \`occupation\`, \`marital_status\`, \`cool_id\`, \`member_status\`, \`photo_url\`, \`qr_token\`) VALUES\n`;
    const memRows = data.members.map(m => {
      const famId = m.familyId ? `'${escapeSQL(m.familyId)}'` : 'NULL';
      const coolId = m.coolId ? `'${escapeSQL(m.coolId)}'` : 'NULL';
      const rel = m.familyRelation || 1;
      const mar = m.maritalStatus || 1;
      return `('${escapeSQL(m.id)}', '${escapeSQL(m.memberNumber)}', ${famId}, ${rel}, '${escapeSQL(m.fullName)}', '${escapeSQL(m.gender)}', '${escapeSQL(m.birthPlace || '')}', '${escapeSQL(m.birthDate)}', '${escapeSQL(m.whatsappNumber || '')}', '${escapeSQL(m.address || '')}', '${escapeSQL(m.city || '')}', '${escapeSQL(m.district || '')}', '${escapeSQL(m.occupation || '')}', ${mar}, ${coolId}, '${escapeSQL(m.memberStatus)}', '${escapeSQL(m.photoUrl || '')}', '${escapeSQL(m.qrToken)}')`;
    });
    sql += memRows.join(',\n') + ';\n';
  }

  sql += `\nSET FOREIGN_KEY_CHECKS=1;\nCOMMIT;\n-- END OF GBI LOVE INHIL DATABASE EXPORT\n`;
  return sql;
}

/**
 * Generate Laravel 11/12 Migration: 0001_01_01_000001_create_church_tables.php
 */
export function generateLaravelMigration(): string {
  return `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for GBI Love Inhil Database.
     */
    public function up(): void
    {
        // 1. Users & Roles Table
        Schema::create('users', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('email')->nullable()->unique();
            $table->string('password');
            $table->enum('role', ['SUPER_ADMIN', 'ADMINISTRATOR', 'OPERATOR', 'PEMIMPIN_COOL'])->default('ADMINISTRATOR');
            $table->text('avatar_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Church Settings Table
        Schema::create('church_settings', function (Blueprint $table) {
            $table->id();
            $table->string('church_name');
            $table->string('synod')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('senior_pastor')->nullable();
            $table->text('logo_url')->nullable();
            $table->text('signature_url')->nullable();
            $table->text('stamp_url')->nullable();
            $table->timestamps();
        });

        // 3. Families / KKJ Table
        Schema::create('families', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('family_code', 50)->unique();
            $table->string('kkj_number', 50)->unique();
            $table->string('head_member_id', 50)->nullable();
            $table->string('head_name');
            $table->text('address')->nullable();
            $table->string('district', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('whatsapp_number', 50)->nullable();
            $table->date('registered_date')->nullable();
            $table->enum('status', ['AKTIF', 'PINDAH', 'NONAKTIF'])->default('AKTIF');
            $table->timestamps();
        });

        // 4. COOL Groups Table
        Schema::create('cool_groups', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('cool_code', 50)->unique();
            $table->string('cool_name');
            $table->string('leader_member_id', 50)->nullable();
            $table->string('leader_name');
            $table->string('vice_leader_name')->nullable();
            $table->string('schedule_day')->nullable();
            $table->string('schedule_time')->nullable();
            $table->text('location_address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 5. Church Members Table
        Schema::create('church_members', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('member_number', 50)->unique();
            $table->string('family_id', 50)->nullable();
            $table->integer('family_relation')->default(1);
            $table->string('full_name');
            $table->string('nickname')->nullable();
            $table->string('nik', 50)->nullable();
            $table->enum('gender', ['L', 'P']);
            $table->string('birth_place')->nullable();
            $table->date('birth_date');
            $table->string('whatsapp_number', 50)->nullable();
            $table->string('email', 150)->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('district', 100)->nullable();
            $table->string('occupation', 150)->nullable();
            $table->integer('marital_status')->default(1);
            $table->string('cool_id', 50)->nullable();
            $table->enum('member_status', ['AKTIF', 'TIDAK_AKTIF', 'PINDAH', 'MENINGGAL'])->default('AKTIF');
            $table->date('joined_date')->nullable();
            $table->text('photo_url')->nullable();
            $table->string('qr_token')->nullable();
            $table->boolean('wa_opt_in')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('family_id')->references('id')->on('families')->onDelete('set null');
            $table->foreign('cool_id')->references('id')->on('cool_groups')->onDelete('set null');
        });

        // 6. Attendance Records Table
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('service_id', 50);
            $table->string('member_id', 50);
            $table->string('member_name');
            $table->dateTime('check_in_time');
            $table->enum('check_in_method', ['QR_SCAN', 'MANUAL_SEARCH', 'RFID_CARD', 'SELF_CHECKIN'])->default('QR_SCAN');
            $table->string('verified_by')->nullable();
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('church_members')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
        Schema::dropIfExists('church_members');
        Schema::dropIfExists('cool_groups');
        Schema::dropIfExists('families');
        Schema::dropIfExists('church_settings');
        Schema::dropIfExists('users');
    }
};
`;
}

/**
 * Generate Laravel Eloquent Model: app/Models/ChurchMember.php
 */
export function generateLaravelMemberModel(): string {
  return `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use Carbon\\Carbon;

class ChurchMember extends Model
{
    use HasFactory;

    protected $table = 'church_members';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'member_number',
        'family_id',
        'family_relation',
        'full_name',
        'nickname',
        'nik',
        'gender',
        'birth_place',
        'birth_date',
        'whatsapp_number',
        'email',
        'address',
        'city',
        'district',
        'occupation',
        'marital_status',
        'cool_id',
        'member_status',
        'joined_date',
        'photo_url',
        'qr_token',
        'wa_opt_in',
        'notes',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'joined_date' => 'date',
        'wa_opt_in' => 'boolean',
    ];

    /**
     * Relationship: Kartu Keluarga Jemaat (KKJ)
     */
    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class, 'family_id');
    }

    /**
     * Relationship: Komunitas Kasih (COOL)
     */
    public function coolGroup(): BelongsTo
    {
        return $this->belongsTo(COOLGroup::class, 'cool_id');
    }

    /**
     * Relationship: Presensi Ibadah
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class, 'member_id');
    }

    /**
     * Check if birthday is today
     */
    public function isBirthdayToday(): bool
    {
        return $this->birth_date && 
               $this->birth_date->format('m-d') === Carbon::now()->format('m-d');
    }

    /**
     * Calculate current age
     */
    public function getAgeAttribute(): int
    {
        return $this->birth_date ? $this->birth_date->age : 0;
    }
}
`;
}

/**
 * Generate Laravel Seeder: DatabaseSeeder.php
 */
export function generateLaravelDatabaseSeeder(data: LaravelExportData): string {
  const usersPhp = data.users.map(u => `            [
                'id' => '${u.id}',
                'name' => '${u.fullName}',
                'username' => '${u.username}',
                'email' => '${u.email || ''}',
                'password' => bcrypt('${u.password || 'admin123'}'),
                'role' => '${u.role}',
                'avatar_url' => '${u.avatarUrl || ''}',
                'is_active' => ${u.isActive ? 'true' : 'false'},
            ]`).join(',\n');

  const cs = data.churchSettings;

  return `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Facades\\DB;
use App\\Models\\User;
use App\\Models\\Family;
use App\\Models\\COOLGroup;
use App\\Models\\ChurchMember;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with GBI Love Inhil live data.
     */
    public function run(): void
    {
        // 1. Seed Church Settings
        DB::table('church_settings')->insert([
            'church_name' => '${cs.churchName}',
            'synod' => '${cs.synod}',
            'address' => '${cs.address}',
            'city' => '${cs.city}',
            'province' => 'Riau',
            'postal_code' => '29212',
            'phone' => '${cs.phone}',
            'email' => '${cs.email}',
            'senior_pastor' => '${cs.seniorPastor}',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Seed Users & RBAC Roles
        DB::table('users')->insert([
${usersPhp}
        ]);

        $this->command->info('GBI Love Inhil Database Seeded Successfully!');
    }
}
`;
}

/**
 * Generate Laravel API Routes: routes/api.php
 */
export function generateLaravelApiRoutes(): string {
  return `<?php

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\AuthController;
use App\\Http\\Controllers\\Api\\MemberController;
use App\\Http\\Controllers\\Api\\FamilyController;
use App\\Http\\Controllers\\Api\\COOLController;
use App\\Http\\Controllers\\Api\\AttendanceController;
use App\\Http\\Controllers\\Api\\WhatsAppController;

/*
|--------------------------------------------------------------------------
| GBI Love Inhil RESTful API Routes (Laravel 11 / 12)
|--------------------------------------------------------------------------
*/

// Public Authentication
Route::post('/login', [AuthController::class, 'login']);

// Authenticated Routes (Sanctum / Token Auth)
Route::middleware('auth:sanctum')->group(function () {
    // Current User Profile & Role Check
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Master Data Jemaat
    Route::apiResource('members', MemberController::class);
    Route::get('/members/birthday/today', [MemberController::class, 'todayBirthdays']);
    Route::get('/members/birthday/upcoming', [MemberController::class, 'upcomingBirthdays']);

    // Kartu Keluarga Jemaat (KKJ)
    Route::apiResource('families', FamilyController::class);
    Route::get('/families/{id}/print-kkj', [FamilyController::class, 'printKKJ']);

    // Komunitas Kasih (COOL)
    Route::apiResource('cool-groups', COOLController::class);

    // Presensi Ibadah QR Check-in
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
    Route::get('/attendance/services', [AttendanceController::class, 'services']);
    Route::get('/attendance/stats', [AttendanceController::class, 'stats']);

    // WhatsApp Automation
    Route::post('/whatsapp/send-birthday', [WhatsAppController::class, 'sendBirthdayGreeting']);
    Route::get('/whatsapp/logs', [WhatsAppController::class, 'logs']);
});
`;
}
