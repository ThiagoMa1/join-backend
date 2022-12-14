import express from "express";

import { clientesController } from "../controllers/clientes";

const router = express.Router();

// localhost:3000/

////// CRIAÇÃO
router.post("/add-cliente", clientesController.postAddCliente);

router.post("/add-endereco/:clienteId", clientesController.postAddEndereço);

////// LEITURA
router.get("/", clientesController.getClientesNames);

router.get("/clientes", clientesController.getAllClientes);

router.get("/clientes/:clienteId", clientesController.getClienteById);

////// ALTERAÇÃO
router.post("/edit-cliente/:clienteId", clientesController.postEditClienteById);

router.post(
  "/edit-endereco/:clienteId/:enderecoId",
  clientesController.postEditEndereçoByIds
);

////// REMOÇÃO
router.post("/delete-cliente/:clienteId", clientesController.deleteClienteById);

router.post(
  "/delete-endereco/:clienteId/:enderecoId",
  clientesController.deleteEndereçoByIds
);

export default router;
