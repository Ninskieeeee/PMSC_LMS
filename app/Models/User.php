<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'access_code', 'address', 'avatar_path', 'theme_preference'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $appends = ['avatar_url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected function avatarUrl(): Attribute
    {
        return Attribute::get(fn () => $this->avatar_path ? Storage::disk('public')->url($this->avatar_path) : null);
    }

    public function student(): HasOne
    {
        return $this->hasOne(Student::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class, 'teacher_id');
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'teacher_id');
    }

    public static function generateAccessCode(string $role): string
    {
        $prefixes = [
            'admin' => 'ADM',
            'teacher' => 'TCH',
            'finance' => 'FIN',
            'ssg' => 'SSG',
            'student' => 'STD',
            'parent' => 'PAR',
        ];

        $prefix = $prefixes[$role] ?? strtoupper(substr($role, 0, 3));
        $sequence = static::where('role', $role)->count();

        do {
            $sequence++;
            $code = sprintf('%s-%05d', $prefix, $sequence);
        } while (static::where('access_code', $code)->exists());

        return $code;
    }

    public static function generateTempPassword(): string
    {
        return Str::upper(Str::random(1)).Str::lower(Str::random(6)).random_int(100, 999);
    }
}
