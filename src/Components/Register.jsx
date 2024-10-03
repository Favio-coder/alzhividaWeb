import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash, FaUserCircle } from 'react-icons/fa';
import './Styles/Register.css';
import appFirebase from "../credenciales"; // Asegúrate de que la inicialización de Firebase esté correcta
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Ajustes aquí
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import HeaderComponent from './HeaderComponent';

// Inicializa Firebase
const auth = getAuth(appFirebase);
const firestore = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [alert, setAlert] = useState(0);
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        nacionalidad: '',
        sexo: '',
        nombreUsuario: '',
        fotoPerfil: null,
        email: '',
        password: '',
        repeatPassword: '',
        rol: 'user_simple',
        fechaCreacion: new Date(),
        fechaCambioRol: new Date()
    });
    const [fotoUrl, setFotoUrl] = useState(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, fotoPerfil: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotoUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFotoUrl(null);
        }
    };

    const handleSubmitStep1 = (e) => {
        e.preventDefault();
        const { nombre, apellidos, nacionalidad, nombreUsuario, sexo } = formData;
        if (!nombre || !apellidos || !nacionalidad || !nombreUsuario || !sexo) {
            setAlert(1);
            return;
        }
        setStep(2);
        setAlert(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { password, repeatPassword, fotoPerfil } = formData;

        if (password.length < 8) {
            setAlert(2);
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setAlert(3);
            return;
        }
        if (password !== repeatPassword) {
            setAlert(4);
            return;
        }

        try {
            // Registro del usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            let imageUrl = null;

            // Si el usuario subió una foto de perfil, se sube a Firebase Storage
            if (fotoPerfil) {
                const storageRef = ref(storage, `usuarios/${user.uid}/fotoPerfil`);
                await uploadBytes(storageRef, fotoPerfil); // Subir archivo
                imageUrl = await getDownloadURL(storageRef); // Obtener URL de la imagen
            }

            // Verificar y mostrar los datos que se guardarán
            console.log("Datos del usuario:", {
                ...formData,
                fotoPerfil: imageUrl // Guardar la URL de la imagen si existe
            });

            // Guardar los datos del usuario en Firestore
            const userRef = doc(firestore, 'usuarios', user.uid); // Cambiado a doc
            await setDoc(userRef, {
                ...formData,
                rol: formData.rol,
                fechaCreacion: formData.fechaCreacion,
                fechaCambioRol: formData.fechaCambioRol,
                fotoPerfil: imageUrl  // Guardar la URL de la imagen si existe
            }); // Cambiado a setDoc

            setAlert(6);
            setTimeout(() => {
                navigate('/login'); // Redirigir al inicio de sesión después de 2 segundos
            }, 2000);

        } catch (error) {
            const errorCode = error.code;
            console.error("Error al registrar el usuario:", error); // Imprimir el error en la consola
            if (errorCode === "auth/email-already-in-use") {
                setAlert(5);
            } else {
                setAlert(6);
            }
        }
    };

    return (
        <div className="login-container">
            <HeaderComponent />

            <form className="form-register" onSubmit={step === 1 ? handleSubmitStep1 : handleSubmit}>
                <h2 className="text-center">{step === 1 ? "Paso 1: Información Personal" : "Paso 2: Credenciales"}</h2>

                {alert === 1 && <div className="alert alert-danger">Por favor, complete todos los campos obligatorios.</div>}
                {alert === 2 && <div className="alert alert-danger">La contraseña debe tener al menos 8 caracteres.</div>}
                {alert === 3 && <div className="alert alert-danger">La contraseña debe contener al menos una letra mayúscula.</div>}
                {alert === 4 && <div className="alert alert-danger">Las contraseñas no coinciden.</div>}
                {alert === 5 && <div className="alert alert-danger">No se puede crear la cuenta. ¡Correo ya utilizado!</div>}
                {alert === 6 && <div className="alert alert-success">Usuario registrado con éxito. Redirigiendo a inicio de sesión...</div>}

                {step === 1 && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="fotoPerfil" className="form-label">Foto de Perfil (Opcional)</label>
                            <div className="input-group mb-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleFileChange}
                                />
                                <span className="input-group-text">
                                    <FaUserCircle />
                                </span>
                            </div>
                            {fotoUrl && (
                                <div className="avatar-container">
                                    <img src={fotoUrl} alt="Avatar" className="avatar" />
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre(s)</label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                className="form-control"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="apellidos" className="form-label">Apellidos</label>
                            <input
                                type="text"
                                name="apellidos"
                                placeholder="Apellidos"
                                className="form-control"
                                value={formData.apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nombreUsuario" className="form-label">Nombre de Usuario</label>
                            <input
                                type="text"
                                name="nombreUsuario"
                                placeholder="Nombre de Usuario"
                                className="form-control"
                                value={formData.nombreUsuario}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="sexo" className="form-label">Sexo</label>
                            <select
                                name="sexo"
                                className="form-select"
                                value={formData.sexo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione su sexo</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nacionalidad" className="form-label">País de origen</label>
                            <select
                                name="nacionalidad"
                                className="form-select"
                                value={formData.nacionalidad}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione su nacionalidad</option>
                                <option value="Venezolano">Venezolano</option>
                                <option value="Colombiano">Colombiano</option>
                                <option value="Peruano">Peruano</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary">Siguiente</button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Correo Electrónico"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <div className="input-group mb-2">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Contraseña"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="input-group-text" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="repeatPassword" className="form-label">Repetir Contraseña</label>
                            <div className="input-group mb-2">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="repeatPassword"
                                    placeholder="Repetir Contraseña"
                                    className="form-control"
                                    value={formData.repeatPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="input-group-text" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-success">Registrar</button>
                    </>
                )}
            </form>
        </div>
    );
};

export default Register;
