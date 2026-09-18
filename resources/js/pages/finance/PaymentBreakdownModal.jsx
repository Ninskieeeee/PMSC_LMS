import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import api from '../../utils/api'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../../utils/helpers'

const EMPTY_FORM = { name: '', amount: '' }

export default function PaymentBreakdownModal({ open, onClose, student }) {
  const [breakdown, setBreakdown] = useState(null)
  const [loading, setLoading] = useState(false)
  const [categoryForm, setCategoryForm] = useState(EMPTY_FORM)
  const [editingCategory, setEditingCategory] = useState(null)
  const [savingCategory, setSavingCategory] = useState(false)
  const [categoryError, setCategoryError] = useState('')

  function load() {
    if (!student) return
    setLoading(true)
    api
      .get(`/finance/students/${student.id}/payment-breakdown`)
      .then((res) => setBreakdown(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (open) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, student?.id])

  function startEdit(category) {
    setEditingCategory(category)
    setCategoryForm({ name: category.name, amount: category.amount })
    setCategoryError('')
  }

  function cancelEdit() {
    setEditingCategory(null)
    setCategoryForm(EMPTY_FORM)
    setCategoryError('')
  }

  async function submitCategory(event) {
    event.preventDefault()
    setSavingCategory(true)
    setCategoryError('')
    try {
      if (editingCategory) {
        await api.put(`/finance/students/${student.id}/fee-categories/${editingCategory.id}`, categoryForm)
      } else {
        await api.post(`/finance/students/${student.id}/fee-categories`, categoryForm)
      }
      cancelEdit()
      load()
    } catch (err) {
      setCategoryError(err.response?.data?.message ?? 'Unable to save fee category.')
    } finally {
      setSavingCategory(false)
    }
  }

  async function deleteCategory(category) {
    await api.delete(`/finance/students/${student.id}/fee-categories/${category.id}`)
    if (editingCategory?.id === category.id) cancelEdit()
    load()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Payment Source Breakdown — ${student?.user?.name ?? ''}`}
      size="xl"
    >
      {loading || !breakdown ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading…</p>
      ) : (
        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-100">Fee Categories</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              The categories that make up this student's total charges. Categories with a ₱0 amount are ignored in the breakdown.
            </p>

            <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-slate-800 text-left text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {breakdown.categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-4 text-center text-gray-400 dark:text-slate-500">
                        No fee categories set up yet.
                      </td>
                    </tr>
                  ) : (
                    breakdown.categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{category.name}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(category.amount)}</td>
                        <td className="px-3 py-2">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => startEdit(category)}
                              className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700"
                              aria-label="Edit category"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteCategory(category)}
                              className="rounded-lg p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                              aria-label="Delete category"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-slate-800">
                    <td className="px-3 py-2 text-xs font-semibold uppercase text-gray-600 dark:text-slate-300">Total Charges</td>
                    <td className="px-3 py-2 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(breakdown.total_charges)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            <form onSubmit={submitCategory} className="mt-3 flex flex-wrap items-end gap-2">
              <div className="flex-1 min-w-[140px]">
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Category Name</label>
                <input
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Tuition Fees"
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="w-32">
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-300">Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={categoryForm.amount}
                  onChange={(e) => setCategoryForm({ ...categoryForm, amount: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={savingCategory}
                className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
              >
                <Plus size={14} /> {editingCategory ? 'Update' : 'Add'}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              )}
            </form>
            {categoryError && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{categoryError}</p>}
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-100">Breakdown Per Payment</h3>
            {breakdown.payments.length === 0 ? (
              <div className="mt-2">
                <EmptyState title="No payments recorded yet" />
              </div>
            ) : breakdown.categories.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                Add at least one fee category above to see how payments are applied.
              </p>
            ) : (
              <div className="mt-3 space-y-4">
                {breakdown.payments.map((payment) => (
                  <div key={payment.payment_id} className="rounded-lg border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(payment.date)}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{payment.notes ?? '—'}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</p>
                    </div>
                    <table className="w-full text-sm">
                      <thead className="text-left text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
                        <tr>
                          <th className="px-3 py-1.5">Fee Category</th>
                          <th className="px-3 py-1.5 text-right">Category Total</th>
                          <th className="px-3 py-1.5 text-right">Applied This Payment</th>
                          <th className="px-3 py-1.5 text-right">Remaining Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {payment.allocations.map((allocation) => (
                          <tr key={allocation.fee_category_id}>
                            <td className="px-3 py-1.5">{allocation.name}</td>
                            <td className="px-3 py-1.5 text-right">{formatCurrency(allocation.category_amount)}</td>
                            <td className="px-3 py-1.5 text-right text-emerald-700 dark:text-emerald-400">
                              {formatCurrency(allocation.amount_applied)}
                            </td>
                            <td className="px-3 py-1.5 text-right">{formatCurrency(allocation.remaining_after)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {payment.credit > 0 && (
                      <p className="border-t border-gray-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400">
                        {formatCurrency(payment.credit)} of this payment exceeded all remaining charges — recorded as unallocated credit.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-4">
            <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">Summary</h3>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Total Charges</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(breakdown.total_charges)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Total Applied</p>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{formatCurrency(breakdown.total_applied)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Total Remaining</p>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">{formatCurrency(breakdown.total_remaining)}</p>
              </div>
              {breakdown.total_credit > 0 && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Unallocated Credit</p>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{formatCurrency(breakdown.total_credit)}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </Modal>
  )
}
