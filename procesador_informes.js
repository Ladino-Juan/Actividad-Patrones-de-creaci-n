
// 1. "Interfaces" de Productos Abstractos

class InformeFactura { procesar() { throw new Error("Método no implementado"); } }
class InformeCompra { procesar() { throw new Error("Método no implementado"); } }
class InformePedido { procesar() { throw new Error("Método no implementado"); } }

// 2. Productos Concretos

// --- Categoría ENTRADA ---
class FacturaEntrada extends InformeFactura {
    procesar() { console.log("Procesando informe de ENTRADA de tipo FACTURA"); }
}
class CompraEntrada extends InformeCompra {
    procesar() { console.log("Procesando informe de ENTRADA de tipo COMPRA"); }
}
class PedidoEntrada extends InformePedido {
    procesar() { console.log("Procesando informe de ENTRADA de tipo PEDIDO"); }
}

// --- Categoría SALIDA ---
class FacturaSalida extends InformeFactura {
    procesar() { console.log("Procesando informe de SALIDA de tipo FACTURA"); }
}
class CompraSalida extends InformeCompra {
    procesar() { console.log("Procesando informe de SALIDA de tipo COMPRA"); }
}

// --- Categoría MIXTA ---
class FacturaMixta extends InformeFactura {
    procesar() { console.log("Procesando informe de MIXTA de tipo FACTURA"); }
}
class CompraMixta extends InformeCompra {
    procesar() { console.log("Procesando informe de MIXTA de tipo COMPRA"); }
}


// 3. Interfaz de la Fábrica Abstracta

class InformeFactory {
    crearFactura() { throw new Error("Método no implementado"); }
    crearCompra() { throw new Error("Método no implementado"); }
    crearPedido() { throw new Error("Método no implementado"); }
}

// 4. Fábricas Concretas

class EntradaFactory extends InformeFactory {
    crearFactura() { return new FacturaEntrada(); }
    crearCompra() { return new CompraEntrada(); }
    crearPedido() { return new PedidoEntrada(); }
}

class SalidaFactory extends InformeFactory {
    crearFactura() { return new FacturaSalida(); }
    crearCompra() { return new CompraSalida(); }
    crearPedido() { 
        // Salida no tiene pedidos, se respeta la interfaz pero se restringe su uso
        throw new Error("Los informes de SALIDA no soportan el tipo PEDIDO"); 
    }
}

class MixtaFactory extends InformeFactory {
    crearFactura() { return new FacturaMixta(); }
    crearCompra() { return new CompraMixta(); }
    crearPedido() { 
        throw new Error("Los informes de MIXTA no soportan el tipo PEDIDO"); 
    }
}


// 5. Cliente (Procesador principal)

function procesarInformes(reports) {
    reports.forEach(report => {
        // Asumimos formato CAT_TIPO_numero.txt
        const parts = report.split('_');
        if (parts.length < 3) return;

        const categoria = parts[0]; // ENT, SAL, MIX
        const tipo = parts[1];      // FAC, COM, PED
        
        let factory;

        // 1. Seleccionamos la fábrica concreta según la categoría
        switch(categoria) {
            case 'ENT':
                factory = new EntradaFactory();
                break;
            case 'SAL':
                factory = new SalidaFactory();
                break;
            case 'MIX':
                factory = new MixtaFactory();
                break;
            default:
                console.log(`[Error] Categoría desconocida para el archivo: ${report}`);
                return;
        }

        // 2. Usamos la fábrica para crear el producto concreto según el tipo
        try {
            let informe;
            switch(tipo) {
                case 'FAC':
                    informe = factory.crearFactura();
                    break;
                case 'COM':
                    informe = factory.crearCompra();
                    break;
                case 'PED':
                    informe = factory.crearPedido();
                    break;
                default:
                    console.log(`[Error] Tipo desconocido para el archivo: ${report}`);
                    return;
            }
            
            // 3. Procesamos el informe
            informe.procesar();
            
        } catch (error) {
            console.log(`[Advertencia] No se pudo procesar ${report}: ${error.message}`);
        }
    });
}


// 6. Simulación (Main)

const listaInformes = [
    "ENT_FAC_001.txt",
    "SAL_COM_001.txt",
    "MIX_FAC_001.txt",
    "MIX_COM_001.txt",
    "ENT_PED_001.txt",
    "SAL_PED_001.txt" // Este archivo probará el control de errores (Salida no tiene pedido)
];

console.log("--- Iniciando procesamiento de informes ---");
procesarInformes(listaInformes);