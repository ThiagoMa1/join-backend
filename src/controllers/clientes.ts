import { NextFunction, Request, Response } from "express";
import db from "../../models/";

const Cliente = db.Cliente;
const Endereço = db.Endereço;

interface ClienteType {
  0?: [
    dataValues: {
      id: number;
      cnpj: number;
      razão_social: string;
      nome_do_contato: string;
      telefone: number;
    }
  ];
}

interface EndereçoType {
  logradouro: string;
  número: number;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: number;
  // latitude: undefined;
  // longitude: undefined;
  clienteId: number;
}

/////////////////////////////////// CREATE

// CREATE AND CHECK IF THERE ALREADY HAS THE GIVEN CNPJ AND ALSO POPULATES THE "Endereço" TABLE
const postAddCliente = (req: Request, res: Response) => {
  const {
    cnpj,
    razão_social,
    nome_do_contato,
    telefone,
    logradouro,
    número,
    complemento,
    bairro,
    cidade,
    estado,
    cep,
  } = req.body;

  Cliente.findOne({ where: { cnpj: cnpj } })
    .then((cliente: any) => {
      if (cliente) {
        return res.send("Cliente já cadastrado");
      }

      return Cliente.create({ cnpj, razão_social, nome_do_contato, telefone });
    })
    .then((cliente: any) => {
      if (cliente.dataValues) {
        return cliente.createEndereço({
          logradouro,
          número,
          complemento,
          bairro,
          cidade,
          estado,
          cep,
        });
      }

      return res.send("Usuário criado sem endereço!");
    })
    .catch((err: Error) => res.status(400).send(err.message));
};

/////////////////////////////////// READ

// FIND AND SEND AN ARRAY WITH "id" AND "nome_do_contato" FIELDS OF ALL THE CLIENTES
const getClientesNames = (req: Request, res: Response) => {
  Cliente.findAll({ attributes: ["id", "nome_do_contato"] })
    .then((clientes: ClienteType) => {
      res.send(JSON.stringify(clientes, null, 2));
    })
    .catch((err: Error) => console.log(err));
};

// FIND AND SEND AN ARRAY WITH ALL THE INFORMATIONS ABOUT ALL THE CLIENTES
const getAllClientes = (req: Request, res: Response) => {
  Cliente.findAll({ include: Endereço })
    .then((clientes: ClienteType) => {
      res.send(JSON.stringify(clientes, null, 2));
    })
    .catch((err: Error) => console.log(err));
};

// FIND A CLIENTE BY IT'S "id" AND SEND IT'S INFORMATIONS
const getClienteById = (req: Request, res: Response) => {
  const clienteId = req.params.clienteId;
  Cliente.findOne({ where: { id: clienteId }, include: Endereço })
    .then((cliente: any) => {
      if (!cliente) {
        return res.send("Cliente não encontrado!");
      }
      res.send(JSON.stringify(cliente, null, 2));
    })
    .catch((err: Error) => console.log(err));
};

export const clientesController = {
  postAddCliente: postAddCliente,
  getClientesNames: getClientesNames,
  getAllClientes: getAllClientes,
  getClienteById: getClienteById,
};
