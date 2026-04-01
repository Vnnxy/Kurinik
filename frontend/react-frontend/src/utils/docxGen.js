
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

export async function generateDocx(data){
    try{
        const templateRes = await window.electron.invoke('get-docx-template');
        
        if (!templateRes.success || !templateRes.data) {
            throw new Error(`Failed to load template content from main process: ${templateRes.error}`);
        }

        const arrayBuffer = templateRes.data; // This is the template's arrayBuffer
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,    
        });

        doc.render(data); // Render the document with your data
        
        // Generate the output as a Blob
        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            compression: "DEFLATE",
        });
        
        // IMPORTANT: Convert the Blob to an ArrayBuffer. This is an async operation.
        const generatedArrayBuffer = await out.arrayBuffer(); 

        // Return the object containing the necessary data for the main process
        return { 
            success: true, 
            arrayBuffer: generatedArrayBuffer, // <-- THIS IS WHAT WAS MISSING
            mimeType: out.type,                // <-- THIS WAS ALSO MISSING
            message: `Archivo DOCX generado exitosamente.` // Optional message
        };

    } catch (error) {
        console.error("Error generating DOCX in renderer:", error);
        return { 
            success: false, 
            error: error.message || "Error desconocido al generar el DOCX.",
            // It's good practice to also return a default arrayBuffer or null if there's an error
            arrayBuffer: undefined, 
            mimeType: undefined
        };
    }
}