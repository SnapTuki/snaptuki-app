import React, { useEffect, useState } from 'react';
import { User, Save, Plus, Trash2, Users, Shield, RotateCcw } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Formik, Form, FieldArray, Field } from 'formik';
// Ensure you have a GET_RESIDENT query defined in your mutations/queries file
import { UPDATE_RESIDENT_IDENTITY, UPDATE_EMERGENCY_CONTACTS } from '../graphql/mutations';
import { GET_RESIDENT_BY_ID } from '../graphql/queries';

// --- NOTIFICATION COMPONENT ---
const Notification = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-top-10 duration-300 flex items-center gap-3 border ${type === 'success' ? 'bg-emerald-900 border-emerald-500/30 text-emerald-50' : 'bg-rose-900 border-rose-500/30 text-rose-50'
      }`}>
      <div className={`w-2 h-2 rounded-full animate-pulse ${type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
      <p className="text-[10px] font-black uppercase tracking-widest">{message}</p>
    </div>
  );
};

const ResidentOverview = ({ residentId }: { residentId: string }) => {
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // 1. Fetch Resident Data using the ID
  const { data: queryData, loading, error: queryError } = useQuery(GET_RESIDENT_BY_ID, {
    variables: { residentId },
  });

  const resident = queryData?.getResidentById;
  console.log('Resdient ID ', residentId)
  console.log('resident data ', resident)

  // 2. Identity Mutation
  const [updateIdentity] = useMutation(UPDATE_RESIDENT_IDENTITY, {
    onError: (error) => setNotification({ message: `Identity Update Failed: ${error.message}`, type: 'error' }),
    // Automatic cache update is usually handled by Apollo if residentId and fields are returned,
    // but explicit cache modification can be done here if needed.
    refetchQueries: [
      {
        query: GET_RESIDENT_BY_ID,
        variables: { residentId }
      }
    ]
  });

  // 3. Contacts Mutation
  const [updateContacts] = useMutation(UPDATE_EMERGENCY_CONTACTS, {
    onError: (error) => setNotification({ message: `Contacts Update Failed: ${error.message}`, type: 'error' }),
    refetchQueries: [
      {
        query: GET_RESIDENT_BY_ID,
        variables: { residentId }
      }
    ]
  });

  if (loading) return <div className="p-10 text-[10px] font-black uppercase animate-pulse">Loading Resident Data...</div>;
  if (queryError) return <div className="p-10 text-[10px] font-black uppercase text-rose-500">Error loading resident: {queryError.message}</div>;
  if (!resident) return <div className="p-10 text-[10px] font-black uppercase">No resident found.</div>;

  const labelStyle = "text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1";
  const fieldGroup = "bg-white border border-slate-200/60 p-3 rounded-lg hover:border-slate-300 transition-all focus-within:border-blue-500";
  const inputStyle = "w-full bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-300";

  return (
    <div className="relative px-10 py-8 animate-in fade-in duration-700 bg-white/40 rounded-2xl">
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      <Formik
        enableReinitialize={true}
        initialValues={{
          firstName: resident.firstName || '',
          lastName: resident.lastName || '',
          birthDate: resident.birthDate.slice(0, 10),
          gender: resident.gender || 'FEMALE',
          room: resident.room || '',
          mobilityLevel: resident.mobilityLevel || 'INDEPENDENT',
          emergencyContacts: resident.emergencyContacts || [],
        }}
        onSubmit={async (values, { resetForm }) => {
          try {
            // 1. Update Identity
            await updateIdentity({
              variables: {
                input: {
                  residentId: resident.residentId,
                  firstName: values.firstName,
                  lastName: values.lastName,
                  birthDate: new Date(values.birthDate).toISOString(),
                  gender: values.gender,
                }
              }
            });

            // 2. Update Contacts
            await updateContacts({
              variables: {
                residentId: resident.residentId,
                contacts: values.emergencyContacts.map((c: any) => ({
                  name: c.name,
                  relation: c.relation,
                  phone: c.phone,
                  isPrimary: !!c.isPrimary
                }))
              }
            });

            resetForm({ values });
            setNotification({ message: 'Resident Profile Updated Successfully', type: 'success' });
          } catch (err) {
            // Error handled by mutation onError
          }
        }}
      >
        {({ values, dirty, resetForm, isSubmitting }) => (
          <Form>
            <div className="max-w-300 mx-auto space-y-12">
              {/* --- SECTION 01: IDENTITY --- */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-4 h-4 text-slate-900" />
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">01. Core Identity</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  <div className={fieldGroup}>
                    <label className={labelStyle}>First Name</label>
                    <Field name="firstName" className={inputStyle} />
                  </div>
                  <div className={fieldGroup}>
                    <label className={labelStyle}>Last Name</label>
                    <Field name="lastName" className={inputStyle} />
                  </div>
                  <div className={`${fieldGroup} bg-slate-50/50`}>
                    <label className={labelStyle}>MRN (Read Only)</label>
                    <input className={inputStyle} value={resident.mrn} readOnly />
                  </div>
                  <div className={fieldGroup}>
                    <label className={labelStyle}>Date of Birth</label>
                    <Field name="birthDate" type="date" className={inputStyle} />
                  </div>
                  <div className={fieldGroup}>
                    <label className={labelStyle}>Gender</label>
                    <Field as="select" name="gender" className={inputStyle}>
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                      <option value="OTHER">Other</option>
                    </Field>
                  </div>
                </div>
              </section>

              {/* --- SECTION 02: CLINICAL --- */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">02. Clinical Status</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div className={`${fieldGroup} border-l-4 border-l-blue-600`}>
                    <label className={labelStyle}>Suite / Room</label>
                    <Field name="room" className={inputStyle} />
                  </div>
                  <div className={fieldGroup}>
                    <label className={labelStyle}>Mobility Level</label>
                    <Field as="select" name="mobilityLevel" className={inputStyle}>
                      <option value="INDEPENDENT">Independent</option>
                      <option value="ASSISTED">Assisted</option>
                      <option value="WHEELCHAIR">Wheelchair</option>
                      <option value="BEDBOUND">Bedbound</option>
                    </Field>
                  </div>
                </div>
              </section>

              {/* --- SECTION 03: CONTACTS --- */}
              <section>
                <FieldArray name="emergencyContacts">
                  {({ push, remove }) => (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 text-slate-900" />
                          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">03. Contacts</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => push({ id: null, name: '', relation: '', phone: '', isPrimary: false })}
                          className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2"
                        >
                          <Plus className="w-3 h-3" /> Add New
                        </button>
                      </div>
                      <div className="space-y-2">
                        {values.emergencyContacts.map((contact: any, index: number) => (
                          <div key={contact.id || index} className="flex items-center gap-3 group">
                            <div className="flex-1 grid grid-cols-3 gap-3 bg-white border border-slate-200 p-2 rounded-xl">
                              <div className="px-3">
                                <label className={labelStyle}>Name</label>
                                <Field name={`emergencyContacts.${index}.name`} className={inputStyle} />
                              </div>
                              <div className="px-3 border-l border-slate-100">
                                <label className={labelStyle}>Relationship</label>
                                <Field name={`emergencyContacts.${index}.relation`} className={inputStyle} />
                              </div>
                              <div className="px-3 border-l border-slate-100">
                                <label className={labelStyle}>Phone</label>
                                <Field name={`emergencyContacts.${index}.phone`} className={inputStyle} />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </FieldArray>
              </section>
            </div>

            {/* --- FLOATING ACTION BAR --- */}
            {dirty && (
              <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-10">
                <div className="bg-slate-900 text-white p-2 pl-6 rounded-2xl shadow-2xl flex items-center gap-8 border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unsaved Changes</p>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => resetForm()}
                      className="px-4 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-white flex items-center gap-2"
                    >
                      <RotateCcw className="w-3 h-3" /> Discard
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-900/40 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResidentOverview;