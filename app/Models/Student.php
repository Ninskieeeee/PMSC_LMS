<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'year_level', 'strand', 'qr_code', 'address', 'guardian_name', 'guardian_contact', 'date_enrolled'])]
class Student extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_enrolled' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function attendance(): HasMany
    {
        return $this->hasMany(EventAttendance::class);
    }

    public function feeCategories(): HasMany
    {
        return $this->hasMany(FeeCategory::class);
    }

    /**
     * Each payment row carries the fee assessed as of that installment, so the
     * currently assessed total is the most recently recorded value, not a sum
     * across every installment.
     */
    public function currentTotalFee(): float
    {
        return (float) ($this->payments->sortByDesc('created_at')->first()?->total_fee ?? 0);
    }

    public function totalPaid(): float
    {
        return (float) $this->payments->sum('amount_paid');
    }

    public function balance(): float
    {
        return $this->currentTotalFee() - $this->totalPaid();
    }
}
