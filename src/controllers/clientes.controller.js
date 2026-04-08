const Cliente = require("../models/clientes.model");

exports.getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.getClientes();
        res.json(clientes);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ error: "Error al obtener clientes" });
    }
};

exports.getClienteById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const cliente = await Cliente.getClienteById(id);
        if (!cliente) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.json(cliente);
    } catch (error) {
        console.error("Error al obtener cliente:", error);
        res.status(500).json({ error: "Error al obtener cliente" });
    }
};

exports.createCliente = async (req, res) => {
    try {
        const nuevoCliente = await Cliente.createCliente(req.body);
        res.status(201).json({
            message: "Cliente creado correctamente",
            ...nuevoCliente
        });
    } catch (error) {
        console.error("Error al crear cliente:", error);
        res.status(500).json({ error: "Error al crear cliente" });
    }
};

exports.updateCliente = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const actualizado = await Cliente.updateCliente(id, req.body);

        if (!actualizado) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.json({ message: "Cliente actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ error: "Error al actualizar cliente" });
    }
};

exports.deleteCliente = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const eliminado = await Cliente.deleteCliente(id);

        if (!eliminado) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ error: "Error al eliminar cliente" });
    }
};