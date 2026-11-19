import { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom'; // <-- Added Router Link
import {
  Search,
  X,
  UserPlus,
  FileText,
  Users,
  Settings,
  Check,
  AlertCircle
} from "lucide-react";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { GET_RESIDENT_SUGGESTIONS } from '../../../features/residents/graphql/queries';
import { type ResidentType } from '../../../lib/graphql/generated';
import { REGISTER_RESIDENT } from '../../../features/residents/graphql/mutations';
import { useAuthStore } from '../../../lib/store/authStore';

/**
 * --- HELPER UI COMPONENTS ---
 */
function HeaderAction({ icon: Icon, label, onClick, primary = false }: { icon: any, label: string, onClick: () => void, primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all backdrop-blur-md shadow-sm border ${primary
          ? 'bg-blue-600/90 hover:bg-blue-600 border-blue-500 text-white shadow-blue-500/20'
          : 'bg-white/60 hover:bg-white hover:shadow-md border-slate-200 text-slate-700'
        }`}
    >
      <Icon className={`w-4 h-4 ${primary ? 'text-white' : 'text-slate-500'}`} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}


const NotificationToast = ({
  message,
  type,
  onClose
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(onClose, 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-xl px-5 py-4 shadow-xl ${type === 'success'
          ? 'bg-teal-600 text-white'
          : 'bg-rose-500 text-white'
        }`}
    >
      {type === 'success' ? (
        <Check className="h-5 w-5 shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0" />
      )}

      <span className="text-sm">{message}</span>

      <button onClick={onClose}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export function Residents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { user } = useAuthStore();

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  const { data, refetch, error } = useQuery(
    GET_RESIDENT_SUGGESTIONS,
    {
      fetchPolicy: 'cache-and-network'
    }
  );

  const [registerResident] =
    useMutation(REGISTER_RESIDENT);

  const residents: ResidentType[] =
    data?.residentList || [];

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];

    return residents
      .filter((r) => {
        const query =
          searchTerm.toLowerCase();

        return (
          `${r.firstName} ${r.lastName}`
            .toLowerCase()
            .includes(query) ||
          (r.mrn ?? '')
            .toLowerCase()
            .includes(query)
        );
      })
      .slice(0, 10);
  }, [searchTerm, residents]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          e.target as Node
        )
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handler
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handler
      );
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: '',
      ssn: '',
      room: '',
      mobilityLevel: ''
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required(
        'First name is required'
      ),
      lastName: Yup.string().required(
        'Last name is required'
      ),
      birthDate: Yup.string().required(
        'Date of birth is required'
      ),
      gender: Yup.string().required(
        'Gender is required'
      ),
      ssn: Yup.string().required(
        'SSN is required'
      ),
      room: Yup.string().required(
        'Room assignment is required'
      ),
      mobilityLevel:
        Yup.string().required(
          'Mobility level is required'
        )
    }),

    onSubmit: async (
      values,
      { resetForm }
    ) => {
      if (!user?.agencyId) {
        setNotification({
          type: 'error',
          message:
            'Agency information is missing.'
        });

        return;
      }

      try {
        await registerResident({
          variables: {
            input: {
              agencyId: user.agencyId,
              firstName: values.firstName,
              lastName: values.lastName,
              birthDate: values.birthDate,
              ssn: values.ssn,
              room: values.room,
              gender: values.gender,
              mobilityLevel:
                values.mobilityLevel
            }
          }
        });

        await refetch();

        resetForm();

        setIsAddModalOpen(false);

        setNotification({
          type: 'success',
          message: `${values.firstName} ${values.lastName} admitted successfully`
        });
      } catch (err) {
        console.error(err);

        setNotification({
          type: 'error',
          message:
            'Unable to admit resident.'
        });
      }
    }
  });

  if (error) {
    console.error(error);
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors focus:border-teal-500';

  return (
    <div className="min-h-screen bg-slate-50">

      <NotificationToast
        message={notification?.message || ''}
        type={
          notification?.type ||
          'success'
        }
        onClose={() =>
          setNotification(null)
        }
      />

      {/* Header */}

      <header className="fixed top-0  right-0 left-0 h-20 z-40 bg-white border-b border-slate-200">
        <div className="h-full px-10 flex items-center justify-between">

          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Residents
            </h1>

            <p className="text-sm text-slate-500">
              Search and manage resident
              profiles
            </p>
          </div>

          <button
            onClick={() =>
              setIsAddModalOpen(true)
            }
            className="h-10 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl flex items-center gap-2 text-sm font-medium transition-all"
          >
            <UserPlus className="h-4 w-4" />
            Admit Resident
          </button>

        </div>
      </header>

      <main className="pt-16">

        {/* Search */}

        <div
          className="relative mb-8"
          ref={searchRef}
        >
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchTerm}
            placeholder="Search resident by name or MRN"
            onChange={(e) => {
              setSearchTerm(
                e.target.value
              );
              setShowSuggestions(true);
            }}
            className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 outline-none focus:border-teal-500"
          />

          {showSuggestions &&
            suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white">

                {suggestions.map((r) => (
                  <Link
                    key={r.residentId}
                    to={`/dashboard/residents/${r.residentId}`}
                    className="block border-b border-slate-100 p-4 transition-all last:border-0 hover:bg-teal-50"
                  >
                    <div className="flex items-center gap-4">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-700">
                        {r.firstName?.[0]}
                        {r.lastName?.[0]}
                      </div>

                      <div>
                        <h3 className="font-medium text-slate-900">
                          {r.firstName}{' '}
                          {r.lastName}
                        </h3>

                        <p className="text-sm text-slate-500">
                          MRN:{' '}
                          {r.mrn || 'N/A'} •
                          Room{' '}
                          {r.room || 'N/A'}
                        </p>
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            )}
        </div>

        {/* Statistics */}

        <div className="mb-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Users className="mb-4 h-6 w-6 text-teal-600" />

            <p className="text-sm text-slate-500">
              Active Residents
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              {residents.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Occupied Rooms
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              {
                new Set(
                  residents.map(
                    (r) => r.room
                  )
                ).size
              }
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Matching Results
            </p>

            <h2 className="mt-2 text-3xl font-semibold text-teal-600">
              {suggestions.length}
            </h2>
          </div>

        </div>

      </main>

      {/* Admit Resident Modal */}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white">

            <div className="border-b border-slate-200 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-semibold">
                    Admit Resident
                  </h2>

                  <p className="text-sm text-slate-500">
                    Create a new resident
                    profile
                  </p>
                </div>

                <button
                  onClick={() =>
                    setIsAddModalOpen(
                      false
                    )
                  }
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

            </div>

            <form
              onSubmit={
                formik.handleSubmit
              }
              className="overflow-y-auto p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    First Name
                  </label>

                  <input
                    {...formik.getFieldProps(
                      'firstName'
                    )}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Last Name
                  </label>

                  <input
                    {...formik.getFieldProps(
                      'lastName'
                    )}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    {...formik.getFieldProps(
                      'birthDate'
                    )}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Gender
                  </label>

                  <select
                    {...formik.getFieldProps(
                      'gender'
                    )}
                    className={inputClass}
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="MALE">
                      Male
                    </option>

                    <option value="FEMALE">
                      Female
                    </option>

                    <option value="OTHER">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    SSN
                  </label>

                  <input
                    {...formik.getFieldProps(
                      'ssn'
                    )}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Room
                  </label>

                  <input
                    {...formik.getFieldProps(
                      'room'
                    )}
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Mobility Level
                  </label>

                  <select
                    {...formik.getFieldProps(
                      'mobilityLevel'
                    )}
                    className={inputClass}
                  >
                    <option value="">
                      Select Mobility
                      Level
                    </option>

                    <option value="Independent">
                      Independent
                    </option>

                    <option value="Assisted">
                      Assisted
                    </option>

                    <option value="Memory">
                      Memory Care /
                      Restricted
                    </option>
                  </select>
                </div>

              </div>

              <div className="mt-8 flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setIsAddModalOpen(
                      false
                    )
                  }
                  className="flex-1 rounded-xl border border-slate-200 py-3 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-teal-600 py-3 font-medium text-white hover:bg-teal-700"
                >
                  Admit Resident
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </div>
  );
}

export default Residents;