import express from "express";

import { clientesController } from "../controllers/clientes";

const router = express.Router();

// localhost:3000/
router.get("/", clientesController.getClientesNames);

router.post("/add-cliente", clientesController.postAddCliente);

router.get("/clientes", clientesController.getAllClientes);

router.get("/cliente/:clienteId", clientesController.getClienteById);

router.post("/edit-cliente/:id");

router.post("/add-endereço/:id");

router.post("/delete-cliente/:userId/:id");

export default router;
