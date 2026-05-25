import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Save, 
  LogOut, 
  Eye, 
  Globe, 
  Check, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { db, auth, loginWithGoogle, logout, OperationType, handleFirestoreError } from '../lib/firebase';

// Interfaces matching firebase-blueprint.json Schema
export interface ClinicalCase {
  id: string;
  category: string;
  tabLabel: string;
  name: string;
  desc: string;
  challenge: string;
  solution: string;
  material: string;
  duration: string;
  beforeImg?: string | null;
  afterImg: string;
  galleryImages: string[];
  galleryDescriptions?: string[] | null;
  doctorNotes?: string | null;
  createdAt?: any;
  updatedAt?: any;
  orderIndex?: number | null;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCasesUpdated: () => void;
}

export function AdminPanel({ isOpen, onClose, onCasesUpdated }: AdminPanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [tabLabel, setTabLabel] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [material, setMaterial] = useState('');
  const [duration, setDuration] = useState('');
  const [hasBeforeAfter, setHasBeforeAfter] = useState(true);
  const [beforeImg, setBeforeImg] = useState('');
  const [afterImg, setAfterImg] = useState('');
  const [galleryInputUrls, setGalleryInputUrls] = useState<string[]>(['']);
  const [galleryDescriptions, setGalleryDescriptions] = useState<string[]>(['']);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [orderIndex, setOrderIndex] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Trace user session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);
      if (currentUser && currentUser.email === 'mesfede@gmail.com') {
        fetchCases();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setErrorMessage(null);
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.message?.includes('popup-closed-by-user') || err.message?.includes('popup_closed_by_user')) {
        setErrorMessage(
          'Error: La ventana emergente de Google fue bloqueada o cerrada antes de finalizar. Debido a las nuevas políticas de seguridad y bloqueo de cookies de terceros en Google Chrome para iframes, por favor haga clic en el botón de "Abrir en pestaña nueva" (en la esquina superior derecha de la vista previa) de AI Studio e inicie sesión allí para continuar sin restricciones.'
        );
      } else {
        setErrorMessage('Error al autenticar: ' + err.message);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setCases([]);
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchCases = async () => {
    setLoadingCases(true);
    setErrorMessage(null);
    const path = 'cases';
    try {
      const q = collection(db, path);
      const querySnapshot = await getDocs(q);
      const loadedCases: ClinicalCase[] = [];
      querySnapshot.forEach((doc) => {
        loadedCases.push({ id: doc.id, ...doc.data() } as ClinicalCase);
      });

      let finalCases = [...loadedCases];
      // Garantizar que el caso clínico base/defecto siempre se liste si Firestore está completamente vacío o si aún no se ha creado
      const hasDefaultCase = loadedCases.some(c => c.id === 'caso_defecto_1' || c.id === 'case_static_1');
      if (!hasDefaultCase) {
        finalCases.push({
          id: 'caso_defecto_1',
          category: 'Reconstrucción Dental Anterior de Alta Complejidad',
          tabLabel: 'Caso Principal 01',
          name: 'Reconstrucción Dental Anterior de Alta Complejidad',
          desc: 'Restauración biomimética de la arquitectura adamantina mediante microcarillas cerámicas de preparación nula.',
          challenge: 'Paciente presenta un severo desgaste erosivo incisal, desmineralización en el esmalte cervical y diastemas dispersos. Esta pérdida de soporte generaba fatiga biomecánica y sensibilidad constante.',
          solution: 'Se elaboró un plan de adición mínimamente invasivo sin tallar dientes. Se cementaron microcarillas cerámicas sinterizadas imitando las propiedades prismáticas, refractarias y el halo opalescente natural de los dientes.',
          material: 'Porcelana refractaria artesanal (0.3mm)',
          duration: '2 citas (Diseño + Adhesión)',
          beforeImg: '/src/assets/images/bellini_teeth_before_1779371123423.png',
          afterImg: '/src/assets/images/bellini_teeth_after_1779371142222.png',
          galleryImages: [
            '/src/assets/images/bellini_foto01.jpg',
            '/src/assets/images/bellini_foto02.jpg',
            '/src/assets/images/bellini_foto03.jpg'
          ],
          doctorNotes: 'El objetivo prioritario fue restablecer la guía anterior y proteger la articulación temporomandibular mediante una adición aditiva, respetando el tejido biológico sano del paciente.',
          orderIndex: 1
        } as ClinicalCase);
      }

      // Ordenar en memoria por orderIndex (menor número primero) y luego por createdAt desc como respaldo seguro
      const sorted = [...finalCases].sort((a, b) => {
        const valA = (a.orderIndex !== undefined && a.orderIndex !== null) ? Number(a.orderIndex) : 9999;
        const valB = (b.orderIndex !== undefined && b.orderIndex !== null) ? Number(b.orderIndex) : 9999;
        const normA = isNaN(valA) ? 9999 : valA;
        const normB = isNaN(valB) ? 9999 : valB;
        if (normA !== normB) {
          return normA - normB;
        }
        
        const getSecVal = (c: any) => {
          if (c.createdAt) {
            if (typeof c.createdAt.seconds === 'number') return c.createdAt.seconds;
            if (c.createdAt instanceof Date) return c.createdAt.getTime() / 1000;
            if (typeof c.createdAt.toDate === 'function') {
              return c.createdAt.toDate().getTime() / 1000;
            }
          }
          return 0;
        };
        return getSecVal(b) - getSecVal(a);
      });

      setCases(sorted);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.GET, path);
    } finally {
      setLoadingCases(false);
    }
  };

  const resetForm = (keepEditing = false) => {
    setEditId(null);
    setIsEditing(keepEditing);
    setCategory('');
    setTabLabel('');
    setName('');
    setDesc('');
    setChallenge('');
    setSolution('');
    setMaterial('');
    setDuration('');
    setHasBeforeAfter(true);
    setBeforeImg('');
    setAfterImg('');
    setGalleryInputUrls(['']);
    setGalleryDescriptions(['']);
    setDoctorNotes('');
    setOrderIndex('');
    setErrorMessage(null);
  };

  const handleAddGalleryUrl = () => {
    setGalleryInputUrls([...galleryInputUrls, '']);
    setGalleryDescriptions([...galleryDescriptions, '']);
  };

  const handleRemoveGalleryUrl = (index: number) => {
    const updatedU = [...galleryInputUrls];
    updatedU.splice(index, 1);
    setGalleryInputUrls(updatedU.length > 0 ? updatedU : ['']);

    const updatedD = [...galleryDescriptions];
    updatedD.splice(index, 1);
    setGalleryDescriptions(updatedD.length > 0 ? updatedD : ['']);
  };

  const handleGalleryUrlChange = (index: number, val: string) => {
    const updated = [...galleryInputUrls];
    updated[index] = val;
    setGalleryInputUrls(updated);
  };

  const handleEditCase = (c: ClinicalCase) => {
    setEditId(c.id);
    setCategory(c.category || '');
    setTabLabel(c.tabLabel || '');
    setName(c.name || '');
    setDesc(c.desc || '');
    setChallenge(c.challenge || '');
    setSolution(c.solution || '');
    setMaterial(c.material || '');
    setDuration(c.duration || '');
    setHasBeforeAfter(!!c.beforeImg);
    setBeforeImg(c.beforeImg || '');
    setAfterImg(c.afterImg || '');
    setGalleryInputUrls(c.galleryImages && c.galleryImages.length > 0 ? c.galleryImages : ['']);
    setGalleryDescriptions(c.galleryDescriptions && c.galleryDescriptions.length > 0 ? c.galleryDescriptions : Array(c.galleryImages?.length || 1).fill(''));
    setDoctorNotes(c.doctorNotes || '');
    setOrderIndex(c.orderIndex !== undefined && c.orderIndex !== null ? String(c.orderIndex) : '');
    setIsEditing(true);
    setErrorMessage(null);
  };

  const handleDeleteCase = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      // Auto-reset delete confirmation after 4 seconds if they don't click again
      setTimeout(() => {
        setConfirmDeleteId((prev) => (prev === id ? null : prev));
      }, 4000);
      return;
    }

    const path = `cases/${id}`;
    try {
      setErrorMessage(null);
      await deleteDoc(doc(db, 'cases', id));
      setSuccessMessage('Caso clínico eliminado de forma permanente.');
      setConfirmDeleteId(null);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchCases();
      onCasesUpdated();
    } catch (err: any) {
      setErrorMessage('Error al eliminar el caso con ID ' + id + ': ' + err.message);
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Bootstrap initial fallback database case to avoid blank screen
  const handleBootstrapDefault = async () => {
    const path = 'cases/caso_defecto_1';
    try {
      setSubmitting(true);
      setErrorMessage(null);
      
      const existingCase = cases.find(c => c.id === 'caso_defecto_1');
      const defaultCasePayload: any = {
        category: 'Reconstrucción Dental Anterior de Alta Complejidad',
        tabLabel: 'Caso Clínico Principal',
        name: 'Reconstrucción Dental Anterior de Alta Complejidad',
        desc: 'Restauración biomimética de la arquitectura adamantina mediante microcarillas cerámicas de preparación nula.',
        challenge: 'Paciente presenta un severo desgaste erosivo incisal, desmineralización en el esmalte cervical y diastemas dispersos. Esta pérdida de soporte generaba fatiga biomecánica y sensibilidad constante.',
        solution: 'Se elaboró un plan de adición mínimamente invasivo sin tallar dientes. Se cementaron microcarillas cerámicas sinterizadas imitando las propiedades prismáticas, refractarias y el halo opalescente natural de los dientes.',
        material: 'Porcelana refractaria artesanal (0.3mm)',
        duration: '2 citas (Diseño + Adhesión)',
        beforeImg: '/src/assets/images/bellini_teeth_before_1779371123423.png',
        afterImg: '/src/assets/images/bellini_teeth_after_1779371142222.png',
        galleryImages: [
          '/src/assets/images/bellini_foto01.jpg',
          '/src/assets/images/bellini_foto02.jpg',
          '/src/assets/images/bellini_foto03.jpg'
        ],
        doctorNotes: 'El objetivo prioritario fue restablecer la guía anterior y proteger la articulación temporomandibular mediante una adición aditiva, respetando el tejido biológico sano del paciente.',
        orderIndex: 1,
        createdAt: existingCase ? existingCase.createdAt : serverTimestamp()
      };

      if (existingCase) {
        defaultCasePayload.updatedAt = serverTimestamp();
      }
      
      await setDoc(doc(db, 'cases', 'caso_defecto_1'), defaultCasePayload);
      setSuccessMessage('Caso base por defecto importado con éxito!');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchCases();
      onCasesUpdated();
    } catch (err: any) {
      setErrorMessage('Error al inicializar el caso por defecto: ' + err.message);
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tabLabel.trim() || !name.trim()) {
      setErrorMessage('Por favor, defina al menos la Etiqueta del Botón y el Título del Caso Clínico.');
      return;
    }

    const filteredGallery = galleryInputUrls.map(u => u.trim()).filter(u => u !== '');
    // Align gallery descriptions in sync with actual gallery images
    const filteredDescriptions = galleryInputUrls
      .map((url, idx) => ({ url: url.trim(), desc: (galleryDescriptions[idx] || '').trim() }))
      .filter(item => item.url !== '')
      .map(item => item.desc);

    const finalId = editId || `case_${Date.now()}`;
    const path = `cases/${finalId}`;
    const parsedOrder = orderIndex.trim() !== '' ? parseInt(orderIndex.trim(), 10) : null;

    const payload: any = {
      category: category.trim() || 'Gabinete Clínico',
      tabLabel: tabLabel.trim(),
      name: name.trim(),
      desc: desc.trim() || 'Información de este caso clínico en proceso de documentación.',
      challenge: challenge.trim() || 'Diagnóstico y reto clínico en fase de recopilación.',
      solution: solution.trim() || 'Protocolo de tratamiento en proceso de redacción.',
      material: material.trim() || 'Porcelana Sinterizada',
      duration: duration.trim() || '1 o 2 sesiones',
      afterImg: afterImg.trim() || '/src/assets/images/bellini_teeth_after_1779371142222.png',
      galleryImages: filteredGallery,
      galleryDescriptions: filteredDescriptions,
      orderIndex: (typeof parsedOrder === 'number' && !isNaN(parsedOrder)) ? parsedOrder : null,
      createdAt: editId ? (cases.find(c => c.id === editId)?.createdAt || serverTimestamp()) : serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    if (hasBeforeAfter && beforeImg.trim() !== '') {
      payload.beforeImg = beforeImg.trim();
    } else {
      payload.beforeImg = null;
    }

    if (doctorNotes.trim() !== '') {
      payload.doctorNotes = doctorNotes.trim();
    } else {
      payload.doctorNotes = null;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);
      
      await setDoc(doc(db, 'cases', finalId), payload);
      setSuccessMessage(editId ? 'Caso clínico guardado correctamente.' : 'Nuevo caso clínico publicado con éxito.');
      setTimeout(() => setSuccessMessage(null), 3000);
      resetForm();
      fetchCases();
      onCasesUpdated();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isUserAdmin = user && user.email === 'mesfede@gmail.com';

  return (
    <div className="fixed inset-0 bg-black/95 z-[999999] backdrop-blur-xl flex justify-center items-center p-4 overflow-hidden text-[#ECE8E1]">
      <div 
        className="bg-[#0e0e0e] border border-[#222] rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col relative overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#222]/80 bg-[#111]/90">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[var(--color-bellini-primary)]/10 text-[var(--color-bellini-primary)] rounded">
              {isUserAdmin ? <Unlock size={16} /> : <Lock size={16} />}
            </span>
            <div>
              <h3 className="font-serif text-lg text-white">Consola de Administración</h3>
              <p className="text-[10px] text-[#8e8e8e] tracking-widest uppercase mb-0.5">
                Editor de Casos Clínicos en Tiempo Real
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-3 bg-[#1e1e1e] border border-[#333] rounded hover:border-[var(--color-bellini-primary)] text-xs text-[#8e8e8e] hover:text-white cursor-pointer active:scale-95 transition-all"
          >
            Cerrar [esc]
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
          
          {/* Status Panel / Login Screen */}
          {!isUserAdmin ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-[#070707] min-h-0">
              <div className="max-w-md space-y-6">
                <div className="inline-flex p-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full mb-2">
                  <Lock size={32} />
                </div>
                <h4 className="font-serif text-xl text-white">Acceso Restringido a Dirección Clínica</h4>
                <p className="text-xs text-[#8e8e8e] leading-relaxed">
                  Esta sección está reservada únicamente para el editor autorizado. Si usted es el director médico, presione el siguiente botón e inicie sesión con su cuenta de Google.
                </p>

                {user && (
                  <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-lg text-xs text-red-400 text-left">
                    <p className="font-semibold flex items-center gap-2">
                      <AlertTriangle size={13} /> Sesión No Autorizada
                    </p>
                    <p className="mt-1">Inició sesión como <span className="font-mono">{user.email}</span>. Este correo no cuenta con privilegios de escritura.</p>
                  </div>
                )}

                <div className="flex flex-col gap-3 justify-center pt-2">
                  <button 
                    onClick={handleSignIn}
                    className="w-full bg-[var(--color-bellini-primary)] hover:bg-[#fff] text-[#0a0a0a] px-6 py-3 rounded text-[10px] tracking-[0.2em] font-bold uppercase cursor-pointer shadow transition-all duration-300"
                  >
                    Iniciar Sesión con Google ↗
                  </button>
                  {user && (
                    <button 
                      onClick={handleSignOut}
                      className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 underline cursor-pointer bg-transparent border-none"
                    >
                      Cerrar sesión de {user.displayName || 'cuenta'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* LEFT COLUMN: Cases lists & Quick Actions */}
              <div className="w-full md:w-2/5 border-r border-[#222]/80 bg-[#0c0c0c] flex flex-col min-h-0 select-text">
                <div className="p-4 border-b border-[#222]/60 flex justify-between items-center bg-[#111]/30">
                  <div className="text-xs">
                    <p className="text-[#8e8e8e] uppercase tracking-wider text-[9px]">Autenticado como</p>
                    <p className="font-mono text-[var(--color-bellini-primary)] truncate max-w-[180px]">{user?.email}</p>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    title="Cerrar Sesión"
                    className="p-1.5 bg-[#181818] border border-[#333] hover:border-red-500/40 text-red-400 hover:text-red-300 cursor-pointer rounded transition-all active:scale-95 flex items-center gap-1 text-[9px] uppercase tracking-wider"
                  >
                    Salir <LogOut size={11} />
                  </button>
                </div>

                {errorMessage && (
                  <div className="m-3 p-3 bg-red-950/30 border border-red-500/20 text-red-300 rounded text-xs leading-relaxed">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="m-3 p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded text-xs leading-relaxed flex items-center gap-2">
                    <Check size={14} /> {successMessage}
                  </div>
                )}

                <div className="p-3 bg-yellow-950/10 border-b border-[#222]/60 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-[#cbb893] uppercase tracking-wider font-semibold">Configuración Rápida:</span>
                  </div>
                  <button 
                    onClick={handleBootstrapDefault}
                    className="w-full border border-dashed border-[#cbb893]/30 hover:border-[#cbb893]/80 bg-white/[0.01] hover:bg-[#cbb893]/5 text-[#cbb893] text-[9.5px] uppercase tracking-widest py-2 rounded flex justify-center items-center gap-1.5 transition-all font-semibold active:scale-[0.98] cursor-pointer"
                  >
                    <RotateCcw size={12} /> Cargar Caso por Defecto
                  </button>
                </div>

                {/* Cases List */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#666] mb-1">
                    <span>Casos en portafolio ({cases.length})</span>
                    {loadingCases && <span className="animate-pulse">Cargando...</span>}
                  </div>

                  {cases.length === 0 && !loadingCases ? (
                    <div className="text-center py-10 border border-dashed border-[#333] rounded-xl text-xs text-[#8e8e8e] space-y-2">
                      <p>Aún no hay casos clínicos en Firestore.</p>
                      <p className="text-[10px]">Utilice la plantilla por defecto arriba para inicializar con un clic.</p>
                    </div>
                  ) : (
                    cases.map((c) => (
                      <div 
                        key={c.id}
                        className={`p-3 rounded-lg border text-left transition-all relative group ${
                          editId === c.id 
                            ? 'bg-[var(--color-bellini-primary)]/10 border-[var(--color-bellini-primary)]/40' 
                            : 'bg-[#121212]/50 border-[#222] hover:border-[#333]'
                        }`}
                      >
                        <div className="pr-12">
                          <span className="text-[8px] uppercase tracking-widest font-bold text-[var(--color-bellini-primary)] block">
                            {c.category}
                          </span>
                          <h5 className="font-serif text-sm text-[#f4f3ef] mt-0.5 font-light leading-snug line-clamp-1 border-b border-[#222]/30 pb-1">
                            {c.name}
                          </h5>
                          <div className="flex gap-1.5 flex-wrap mt-1.5 items-center">
                            <span className="inline-block bg-[#1a1a1a] text-[#8e8e8e] text-[8px] font-mono px-1.5 py-0.5 rounded border border-[#333]">
                              Menú: {c.tabLabel}
                            </span>
                            <span className="inline-block bg-[#1e1e2d] text-[var(--color-bellini-primary)] text-[8px] font-mono px-1.5 py-0.5 rounded border border-[var(--color-bellini-primary)]/20 font-semibold">
                              Posición: {c.orderIndex !== undefined && c.orderIndex !== null ? `#${c.orderIndex}` : 'Auto (Recientes)'}
                            </span>
                          </div>
                        </div>

                        {/* Direct actions */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 transition-all">
                          <button 
                            onClick={() => handleEditCase(c)}
                            title="Editar Caso"
                            className="p-1 px-1.5 bg-[#1a1a1a] border border-[#333] rounded hover:border-[var(--color-bellini-primary)] text-[var(--color-bellini-primary)] hover:bg-[#202020] transition-all cursor-pointer"
                          >
                            <Edit size={12} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCase(c.id)}
                            title={confirmDeleteId === c.id ? "Haga clic de nuevo para confirmar" : "Eliminar Caso"}
                            className={`p-1 px-1.5 border rounded transition-all cursor-pointer ${
                              confirmDeleteId === c.id
                                ? 'bg-red-950/80 border-red-500 text-red-200 animate-pulse'
                                : 'bg-[#1a1a1a] border-[#333] hover:border-red-500/40 text-red-400 hover:bg-[#202020]'
                            }`}
                          >
                            {confirmDeleteId === c.id ? (
                              <span className="text-[8px] uppercase tracking-wider px-1 font-bold">¿Eliminar?</span>
                            ) : (
                              <Trash2 size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 border-t border-[#222]/80 bg-[#111]/30">
                  <button 
                    onClick={() => resetForm(true)}
                    className="w-full bg-[#1c1c1c] hover:bg-[#252525] border border-[#333] hover:border-[var(--color-bellini-primary)] text-white text-[10px] tracking-widest uppercase font-semibold py-2.5 rounded-lg flex justify-center items-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <Plus size={14} /> Redactar Nuevo Caso
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive Creation/Editing Form */}
              <div className="w-full md:w-3/5 bg-[#080808] flex flex-col min-h-0 select-text">
                {isEditing || editId !== null || cases.length === 0 ? (
                  <form onSubmit={handleSubmit} className="flex-grow flex flex-col h-full min-h-0">
                    <div className="p-4 border-b border-[#222]/80 flex justify-between items-center bg-[#111]/20">
                      <div className="flex flex-col text-left">
                        <h4 className="font-serif text-sm font-light text-[var(--color-bellini-primary)] flex items-center gap-1.5">
                          {editId ? (
                            <>
                              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                              Modificando Caso: {cases.find(c => c.id === editId)?.tabLabel || editId}
                            </>
                          ) : (
                            <>
                              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                              Nuevo Registro Clínico (Creación)
                            </>
                          )}
                        </h4>
                        {editId && (
                          <p className="text-[9.5px] text-[#8e8e8e] font-light mt-0.5">
                            Modificar este formulario sobrescribirá el caso seleccionado.
                          </p>
                        )}
                      </div>
                      {editId ? (
                        <button 
                          type="button" 
                          onClick={() => resetForm(true)}
                          className="text-[var(--color-bellini-primary)] hover:text-white text-[9px] uppercase tracking-wider bg-[#1c1c1c] hover:bg-[#252525] border border-[#333] hover:border-[var(--color-bellini-primary)] px-3 py-1.5 rounded transition-all cursor-pointer font-semibold"
                        >
                          Guardar como Nuevo en su lugar ➔
                        </button>
                      ) : (
                        cases.length > 0 && (
                          <button 
                            type="button" 
                            onClick={() => setIsEditing(false)}
                            className="text-[#8e8e8e] hover:text-white text-[9px] uppercase tracking-wider bg-transparent border-none cursor-pointer"
                          >
                            Cerrar Editor
                          </button>
                        )
                      )}
                    </div>

                    {/* Scrollable inputs wrapper */}
                    <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar text-left">
                      
                      {/* Grid 1: Basic Identifiers */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-[#8e8e8e] font-semibold">
                            Categoría Clínica
                          </label>
                          <input 
                            type="text" 
                            placeholder="Ej. Reconstrucción Anterior"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-xs focus:outline-none transition-colors text-[#ece8e1]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-[#8e8e8e] font-semibold">
                            Etiqueta Botón *
                          </label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Caso 02"
                            value={tabLabel}
                            onChange={(e) => setTabLabel(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-xs focus:outline-none transition-colors text-[#ece8e1]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-[var(--color-bellini-primary)] font-bold flex items-center gap-1">
                            Orden Numérico Posicional
                          </label>
                          <input 
                            type="number" 
                            placeholder="Ej. 1 (menores primero)"
                            value={orderIndex}
                            onChange={(e) => setOrderIndex(e.target.value)}
                            className="w-full bg-[#111] border border-[var(--color-bellini-primary)]/30 focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-xs focus:outline-none transition-colors text-[#ece8e1]"
                          />
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#8e8e8e] font-semibold">
                          Título de Caso Clínico *
                        </label>
                        <input 
                           type="text" 
                           required
                           placeholder="Ej. Reconstrucción Estética de la Dimensión Vertical"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-xs focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#8e8e8e] font-semibold">
                          Breve Resumen Inicial
                        </label>
                        <textarea 
                          rows={2}
                          placeholder="Pequeña introducción explicativa del caso para enganchar al usuario."
                          value={desc}
                          onChange={(e) => setDesc(e.target.value)}
                          className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-xs focus:outline-none transition-colors resize-none"
                        />
                      </div>

                      {/* State Before & Treatment After Text Block */}
                      <div className="grid grid-cols-1 gap-4 border-t border-[#222]/50 pt-5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-amber-500 font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            Diagnóstico y Estado Inicial (Antes)
                          </label>
                          <textarea 
                            rows={3}
                            placeholder="Describa cómo ingresó el paciente o los retos odontológicos que presentaba..."
                            value={challenge}
                            onChange={(e) => setChallenge(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-xs focus:outline-none transition-colors resize-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full text-[#ece8e1]"></span>
                            Tratamiento Clínico Planificado (Después)
                          </label>
                          <textarea 
                            rows={3}
                            placeholder="Detalle el plan de compensación, cementaciones, tallados mínimos o adición..."
                            value={solution}
                            onChange={(e) => setSolution(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-xs focus:outline-none transition-colors resize-none"
                          />
                        </div>
                      </div>

                      {/* Tech Specifications */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#222]/50 pt-5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-[#8e8e8e] font-semibold">
                            Material Utilizado
                          </label>
                          <input 
                            type="text" 
                            placeholder="Ej. Porcelana refractaria artesanal (0.3mm)"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-xs focus:outline-none transition-colors"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-[#8e8e8e] font-semibold">
                            Duración / Sesiones Clínicas
                          </label>
                          <input 
                            type="text" 
                            placeholder="Ej. 2 citas (Diseño + Adhesión)"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-xs focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Primary Image setup (Toggle between Slider & Single Image) */}
                      <div className="border-t border-[#222]/50 pt-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10.5px] uppercase tracking-widest text-[var(--color-bellini-primary)] font-bold">
                            Fotografía Principal
                          </label>
                          <label className="inline-flex items-center gap-2 text-xs text-[#8e8e8e] cursor-pointer selection:bg-transparent">
                            <input 
                              type="checkbox"
                              checked={hasBeforeAfter}
                              onChange={(e) => setHasBeforeAfter(e.target.checked)}
                              className="accent-[var(--color-bellini-primary)] focus:outline-none"
                            />
                            <span>Habilitar efecto interactivo Antes/Después</span>
                          </label>
                        </div>

                        {hasBeforeAfter ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.01] border border-[#222] p-4 rounded-lg">
                            <div className="space-y-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#8e8e8e] font-medium block">
                                Ruta / URL Imagen Antes
                              </label>
                              <input 
                                type="text"
                                placeholder="Ej. /src/assets/images/bellini_teeth_before_1779371123423.png o http://..."
                                value={beforeImg}
                                onChange={(e) => setBeforeImg(e.target.value)}
                                className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-[11px] font-mono focus:outline-none transition-colors"
                              />
                              {beforeImg.trim() !== '' && (
                                <div className="mt-2 aspect-[16/10] overflow-hidden rounded border border-[#222] relative bg-black/60 flex items-center justify-center">
                                  <img 
                                    src={beforeImg} 
                                    className="max-w-full max-h-full object-contain" 
                                    onError={(e) => { (e.target as any).style.display = 'none'; }}
                                    onLoad={(e) => { (e.target as any).style.display = 'block'; }}
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="absolute bottom-1 right-1 text-[7px] text-[#555] font-mono">Antes</span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] uppercase tracking-widest text-[#8e8e8e] font-medium block">
                                Ruta / URL Imagen Después
                              </label>
                              <input 
                                type="text"
                                placeholder="Ej. /src/assets/images/bellini_teeth_after_1779371142222.png o http://..."
                                value={afterImg}
                                onChange={(e) => setAfterImg(e.target.value)}
                                className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-[11px] font-mono focus:outline-none transition-colors"
                              />
                              {afterImg.trim() !== '' && (
                                <div className="mt-2 aspect-[16/10] overflow-hidden rounded border border-[#222] relative bg-black/60 flex items-center justify-center">
                                  <img 
                                    src={afterImg} 
                                    className="max-w-full max-h-full object-contain" 
                                    onError={(e) => { (e.target as any).style.display = 'none'; }}
                                    onLoad={(e) => { (e.target as any).style.display = 'block'; }}
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="absolute bottom-1 right-1 text-[7px] text-[#555] font-mono">Después</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white/[0.01] border border-[#222] p-4 rounded-lg space-y-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#8e8e8e] font-medium block">
                              Ruta / URL Fotografía del Caso
                            </label>
                            <input 
                              type="text"
                              placeholder="Ej. /src/assets/images/bellini_foto01.jpg o http://..."
                              value={afterImg}
                              onChange={(e) => setAfterImg(e.target.value)}
                              className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-[11px] font-mono focus:outline-none transition-colors"
                            />
                            {afterImg.trim() !== '' && (
                              <div className="mt-2 max-w-sm aspect-[16/10] overflow-hidden rounded border border-[#222] relative bg-black/60 flex items-center justify-center mx-auto">
                                <img 
                                  src={afterImg} 
                                  className="max-w-full max-h-full object-contain" 
                                  onError={(e) => { (e.target as any).style.display = 'none'; }}
                                  onLoad={(e) => { (e.target as any).style.display = 'block'; }}
                                  referrerPolicy="no-referrer"
                                />
                                <span className="absolute bottom-1 right-1 text-[7px] text-[#555] font-mono">Imagen Principal</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Process Gallery Input Grid */}
                      <div className="border-t border-[#222]/50 pt-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <label className="text-[10.5px] uppercase tracking-widest text-[var(--color-bellini-primary)] font-bold block">
                              Galería de Imágenes Clínicas Secuenciales
                            </label>
                            <span className="text-[9px] text-[#8e8e8e] block">
                              Rutas o URLs para tomas extra del proceso y detalles del laboratorio.
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={handleAddGalleryUrl}
                            className="text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1.5 bg-[#151515] border border-[#333] rounded text-white hover:border-[var(--color-bellini-primary)] transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                          >
                            <Plus size={12} /> Agregar Imagen
                          </button>
                        </div>

                        <div className="space-y-3">
                          {galleryInputUrls.map((url, index) => (
                            <div key={index} className="flex gap-2 items-start bg-white/[0.01] border border-[#222]/50 p-3 rounded flex-col sm:flex-row w-full">
                              <div className="flex-grow space-y-2 w-full">
                                <div className="space-y-1">
                                  <span className="text-[8.5px] uppercase tracking-wider text-[#666] block">Enlace de Imagen #{index + 1}</span>
                                  <input 
                                    type="text" 
                                    placeholder={`Ej. /src/assets/images/bellini_foto0${(index % 3) + 1}.jpg o http://...`}
                                    value={url}
                                    onChange={(e) => handleGalleryUrlChange(index, e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-1.5 text-[11px] font-mono focus:outline-none transition-colors"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[8.5px] uppercase tracking-wider text-[#666] block">Descripción de esta miniatura (Aparece a la derecha al abrirla)</span>
                                  <textarea 
                                    rows={2}
                                    placeholder="Ej. Vista de perfil lateral demostrando la mimetización y brillo refractario natural..."
                                    value={galleryDescriptions[index] || ''}
                                    onChange={(e) => {
                                      const updatedVal = [...galleryDescriptions];
                                      updatedVal[index] = e.target.value;
                                      setGalleryDescriptions(updatedVal);
                                    }}
                                    className="w-full bg-[#111]/80 border border-[#222] focus:border-[var(--color-bellini-primary)] rounded px-3 py-1.5 text-xs text-[#ece8e1] focus:outline-none transition-colors"
                                  />
                                </div>
                                {url.trim() !== '' && (
                                  <div className="h-14 w-20 overflow-hidden rounded border border-[#222] bg-black/60 flex items-center justify-center">
                                    <img 
                                      src={url} 
                                      className="max-w-full max-h-full object-contain" 
                                      onError={(e) => { (e.target as any).style.display = 'none'; }}
                                      onLoad={(e) => { (e.target as any).style.display = 'block'; }}
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                )}
                              </div>
                              <button 
                                type="button"
                                onClick={() => handleRemoveGalleryUrl(index)}
                                className="p-2 bg-[#1a1a1a] hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-[#333] hover:border-red-500/20 rounded cursor-pointer self-start mt-5 sm:mt-0"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Doctor Notes */}
                      <div className="space-y-1.5 border-t border-[#222]/50 pt-5">
                        <label className="text-[10px] uppercase tracking-widest text-[#8e8e8e] font-semibold">
                          Nota Adicional del Especialista
                        </label>
                        <textarea 
                          rows={3}
                          placeholder="Recomendaciones clínicas finales, observaciones de la mordida anterior o técnicas detalladas..."
                          value={doctorNotes}
                          onChange={(e) => setDoctorNotes(e.target.value)}
                          className="w-full bg-[#111] border border-[#333] focus:border-[var(--color-bellini-primary)] rounded px-3 py-2 text-xs focus:outline-none transition-colors resize-none"
                        />
                      </div>

                    </div>

                    {/* Submit Bar */}
                    <div className="p-4 border-t border-[#222]/80 bg-[#111]/90 flex flex-col sm:flex-row justify-between items-center gap-3">
                      <span className="text-[9px] text-[#666] uppercase tracking-wider">
                        Campos con * son requeridos
                      </span>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          type="button" 
                          onClick={resetForm}
                          className="w-1/2 sm:w-auto px-5 py-2.5 bg-[#1b1b1b] border border-[#333] text-white hover:text-red-400 rounded text-[10px] tracking-wider uppercase font-semibold cursor-pointer active:scale-95 transition-all"
                        >
                          Reiniciar Formulario
                        </button>
                        <button 
                          type="submit" 
                          disabled={submitting}
                          className="w-1/2 sm:w-auto bg-[var(--color-bellini-primary)] hover:bg-white text-[#0a0a0a] px-6 py-2.5 rounded text-[10px] tracking-[0.2em] font-bold uppercase cursor-pointer flex justify-center items-center gap-1.5 active:scale-95 transition-all"
                        >
                          {submitting ? (
                            <span className="animate-pulse">Guardando...</span>
                          ) : (
                            <>
                              Guardar Cambios <Save size={12} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-center p-8 text-[#8e8e8e] space-y-4">
                    <div className="p-4 bg-white/[0.02] border border-[#222] rounded-full text-[var(--color-bellini-primary)]">
                      <Eye size={24} />
                    </div>
                    <div className="max-w-xs space-y-1">
                      <h4 className="font-serif text-[#ECE8E1] text-sm font-medium">Asistente de Escritura Activo</h4>
                      <p className="text-[11px] leading-relaxed">
                        Seleccione un caso clínico a la izquierda para ingresarlo al editor, o cree uno de cero haciendo clic en <strong>Redactar Nuevo Caso</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
