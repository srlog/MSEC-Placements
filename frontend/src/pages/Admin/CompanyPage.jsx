import { useState, useEffect } from 'react';
import { PlusCircle, Edit3, Trash2, Search, X } from 'lucide-react';
import {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany
} from '../../services/companyService';
import FormInput from '../../components/FormInput';
import ErrorBanner from '../../components/ErrorBanner';
import Loader from '../../components/Loader';

// Single-page Company management (responsive, colored table, mobile cards, search/filter, add/edit/delete)
export default function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState('');

  // modal / form state
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [form, setForm] = useState({
    name: '',
    website: '',
    contact_person: '',
    contact_email: '',
    eligibility_criteria: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCompanies();
      setCompanies(data.companies || data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load companies.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCompany(null);
    setForm({
      name: '',
      website: '',
      contact_person: '',
      contact_email: '',
      eligibility_criteria: ''
    });
    setShowModal(true);
  };

  const openEditModal = (company) => {
    setEditingCompany(company);
    setForm({
      name: company.name || '',
      website: company.website || '',
      contact_person: company.contact_person || '',
      contact_email: company.contact_email || '',
      eligibility_criteria: company.eligibility_criteria || ''
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingCompany) {
        const resp = await updateCompany(editingCompany.id, form);
        const updated = resp.company || resp;
        setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const resp = await createCompany(form);
        const created = resp.company || resp;
        setCompanies((prev) => [created, ...prev]);
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to save company. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (companyId) => {
    const confirmed = window.confirm('Are you sure you want to delete this company?');
    if (!confirmed) return;

    try {
      await deleteCompany(companyId);
      setCompanies((prev) => prev.filter((c) => c.id !== companyId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete company.');
    }
  };

  const filteredCompanies = companies.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    const eligibilityQ = eligibilityFilter.trim().toLowerCase();

    const matchesSearch = !q || (c.name && c.name.toLowerCase().includes(q)) || (c.website && c.website.toLowerCase().includes(q));
    const matchesEligibility = !eligibilityQ || (c.eligibility_criteria && c.eligibility_criteria.toLowerCase().includes(eligibilityQ));

    return matchesSearch && matchesEligibility;
  });

  const colorBorders = ['border-indigo-500', 'border-green-500', 'border-yellow-500', 'border-pink-500', 'border-purple-500'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Companies</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or website"
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
              />
            </div>

            <input
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
              placeholder="Filter eligibility"
              className="px-3 py-2 border rounded-lg w-full sm:w-64 mt-2 sm:mt-0"
            />

            <button
              onClick={openAddModal}
              className="inline-flex items-center bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors mt-2 sm:mt-0"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Company
            </button>
          </div>
        </div>

        <ErrorBanner message={error} onClose={() => setError('')} />

        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            {/* Desktop / Tablet: Table */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-50 to-indigo-25">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Website</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Eligibility</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No companies found.</td>
                    </tr>
                  ) : (
                    filteredCompanies.map((company, idx) => (
                      <tr key={company.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{company.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs">
                          {company.website ? (
                            <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">
                              {company.website}
                            </a>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{company.contact_person || '-'} <br /> <a href={`mailto:${company.contact_email}`} className="text-blue-600 hover:underline">{company.contact_email || '-'}</a></td>
                        <td className="px-6 py-4 text-sm text-gray-700">{company.eligibility_criteria || '-'}</td>
                        <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                          <button onClick={() => openEditModal(company)} className="inline-flex items-center px-3 py-1 border rounded hover:bg-gray-100">
                            <Edit3 className="h-4 w-4 mr-2" /> Edit
                          </button>
                          <button onClick={() => handleDelete(company.id)} className="inline-flex items-center px-3 py-1 border rounded hover:bg-gray-100">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile: Card list */}
            <div className="md:hidden space-y-3">
              {filteredCompanies.length === 0 ? (
                <div className="bg-white rounded-lg p-4 text-center text-gray-500">No companies found.</div>
              ) : (
                filteredCompanies.map((company, idx) => (
                  <div key={company.id} className={`bg-white rounded-lg shadow p-4 border-l-4 ${colorBorders[idx % colorBorders.length]}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{company.name}</h3>
                        <p className="text-sm mt-1 truncate">
                          {company.website ? (
                            <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">
                              {company.website}
                            </a>
                          ) : null}
                        </p>

                        <p className="text-sm text-gray-700 mt-2">{company.eligibility_criteria || '-'}</p>

                        <p className="text-sm text-gray-600 mt-3">Contact: {company.contact_person || '-'} <br /> <a href={`mailto:${company.contact_email}`} className="text-blue-600 hover:underline">{company.contact_email || '-'}</a></p>
                      </div>

                      <div className="ml-3 flex-shrink-0 flex flex-col space-y-2">
                        <button onClick={() => openEditModal(company)} className="inline-flex items-center px-3 py-1 border rounded hover:bg-gray-100">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(company.id)} className="inline-flex items-center px-3 py-1 border rounded hover:bg-gray-100">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto overflow-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">{editingCompany ? 'Edit Company' : 'Add Company'}</h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Name" name="name" value={form.name} onChange={handleFormChange} required />
                  <FormInput label="Website" name="website" value={form.website} onChange={handleFormChange} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Contact Person" name="contact_person" value={form.contact_person} onChange={handleFormChange} />
                  <FormInput label="Contact Email" name="contact_email" value={form.contact_email} onChange={handleFormChange} type="email" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                  <textarea
                    name="eligibility_criteria"
                    value={form.eligibility_criteria}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2 min-h-[80px]"
                    placeholder="e.g. CGPA >= 6.5, No active backlogs"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" disabled={saving} className="inline-flex items-center bg-primary-900 text-white px-4 py-2 rounded-lg">
                    {saving ? <Loader size="sm" /> : (editingCompany ? 'Update Company' : 'Create Company')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
