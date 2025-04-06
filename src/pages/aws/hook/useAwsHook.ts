import { useState } from "react";
import type { ArchivoProps, Form, ListarArchivosProps } from "../type/ListarArchivosProps";
import { api_client } from "../service-api";
import { toaster } from "src/components/ui/toaster";

const readFileAsBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = () => {
            const base64Content = btoa(
                new Uint8Array(reader.result as ArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            resolve(base64Content);
        };
        // Manejar errores en la lectura del archivo
        reader.onerror = () => {
            reject(new Error("Error al leer el archivo."));
        };
    });
};
export const useAwsHook = () => {

    const initialize = {
        nombre: '',
        apellido: '',
        archivo: null
    }
    const [form, setForm] = useState<Form>(initialize);
    const [detalle, setDetalle] = useState<ArchivoProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(true);


    const eliminar = async (id: ListarArchivosProps['data']['id']) => {
        const toastId = toaster.create({
            title: 'Eliminando',
            type: 'loading'
        })

        const { data } = await api_client.post('eliminar/' + id);

        if (data) {
            if (!data.error) {
                toaster.update(toastId, {
                    title: data.response, type: 'success'
                });
                listarDetalle();
            } else {
                toaster.update(toastId, {
                    title: data.response, type: 'error'
                })

            }
        }
    }
    const listarDetalle = async () => {
        try {
            setLoading2(true);
            const res = await api_client.get("listar");
            if (res.data.data) {
                setDetalle(res.data.data);
            }
        } catch (error) {

        } finally {

            setLoading2(false);
        }

    }
    const handleForm = async () => {
        if (form.nombre.trim() === '' || form.apellido.trim() === '') {
            toaster.create({
                title: 'Completa todos los campos',
                type: 'error'
            });
            return;
        }
        if(form.archivo == null){
            toaster.create({
                title: 'Coloca un archivo',
                type: 'error'
            });
            return;
        }
        
        
        let contenidoArchivo = await readFileAsBase64(form.archivo!);
        const data = {
            fileContent: contenidoArchivo,
            fileName: form.archivo?.name!,
            fileType: form.archivo?.type!,
            nombre: form.nombre,
            apellido: form.apellido,
        }
        
        setLoading(true);
        const res = await api_client.post('/crea-usuario', data, { headers: { 'Content-Type': 'application/json' } });
        if (res.data) {
            listarDetalle();
            setForm(initialize);
        }
        setLoading(false);
    }
    return {
        form,
        loading,
        loading2,
        detalle,
        setForm,
        handleForm,
        eliminar,
        listarDetalle
    }
}