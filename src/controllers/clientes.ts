import { NextFunction, Request, Response } from "express";
import http from "http";
const { Op } = require("sequelize");

import db from "../../models/";

const Cliente = db.Cliente;
const Endereço = db.Endereço;

/////////////////////////////////// CREATE ///////////////////////////////////

// FUNÇÃO PARA USAR GEOCODING PARA PEGAR A LATITUDE E LONGITUDE, NÃO FOI USADO A API DO GOOGLE POR SER PAGA 0.005 USD per each(5.00 USD per 1000)
const useGeocoding = (cliente: any, endereço: any) => {
  const handleSpaces = (prop: string) => {
    return prop.split(" ").join("%20");
  };

  let data: any = "";
  const request = http.request(
    `http://api.opencagedata.com/geocode/v1/json?q=${handleSpaces(
      endereço.bairro
    )}+${handleSpaces(endereço.cidade)}+${handleSpaces(
      endereço.estado
    )}+Brasil+${
      endereço.cep
    }&key=4abf4c30125b4cf49618dad48c640627&language=en&pretty=1`,
    (response: any) => {
      response.on("data", (chunk: any) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      response.on("end", () => {
        data = JSON.parse(data);
        const geometry = data.results[0].geometry;
        return cliente.createEndereço({
          ...endereço,
          latitude: geometry.lat,
          longitude: geometry.lng,
        });
      });
    }
  );
  request.on("error", (error: Error) => {
    console.error(error);
  });
  request.end();
};

// CREATE AND CHECK IF THERE ALREADY HAS THE GIVEN CNPJ AND ALSO POPULATES THE "Endereço" TABLE
// CRIA E VERIFICA SE JA EXISTE ALGUM CLIENTE COM O CNPJ ENVIADO E TAMBÉM POPULA A TABELA "Endereço"
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

  const cnpjValidator = cnpj.toString().length;

  cnpjValidator !== 14 && res.send("CNPJ precisa ter 14 caracteres");

  cnpjValidator === 14 &&
    Cliente.findOne({ where: { cnpj: cnpj } })
      .then((cliente: any) => {
        if (cliente) {
          return res.send("Cliente já cadastrado");
        }
        res.send("Cliente cadastrado com sucesso!🥳");
        return Cliente.create({
          cnpj,
          razão_social,
          nome_do_contato,
          telefone,
        });
      })
      .then((cliente: any) => {
        if (cliente.dataValues) {
          return useGeocoding(cliente, {
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

// ADICIONA ENDEREÇO AO USUÁRIO CORRESPONDENTE A "id" NO PARAMS DA URL
const postAddEndereço = (req: Request, res: Response) => {
  const clienteId = req.params.clienteId;
  const reqEndereço = req.body;
  let newCliente: any;

  Cliente.findOne({
    where: { id: clienteId },
  })
    .then((cliente: any) => {
      if (cliente) {
        newCliente = cliente;
        return cliente.getEndereços({
          where: {
            [Op.and]: [
              { bairro: reqEndereço.bairro },
              { número: reqEndereço.número },
              { cidade: reqEndereço.cidade },
            ],
          },
        });
      } else {
        return res.send("Não existe cliente com a id informada!");
      }
    })
    .then(async (endereço: any) => {
      if (!endereço.length) {
        await useGeocoding(newCliente, reqEndereço);
        return res.send("Endereço criado com sucesso!");
      } else {
        return res.send(
          "Endereço já cadastrado no cliente. Tente cadastrar outro."
        );
      }
    })
    .catch((err: Error) => res.send(err.message));
};

/////////////////////////////////// READ ///////////////////////////////////

// FIND AND SEND AN ARRAY WITH "id" AND "nome_do_contato" FIELDS OF ALL THE CLIENTES
// ENCONTRA E ENVIA UM ARRAY COM OS CAMPOS "id" E "nome_do_contato" DE TODOS OS CLIENTES
const getClientesNames = (req: Request, res: Response) => {
  Cliente.findAll({
    attributes: ["id", ["nome_do_contato", "Nome do Contato"]],
  })
    .then(([clientes]: any) => {
      if (!clientes) {
        return res.send("Não há clientes registrados");
      }
      return res.send(JSON.stringify(clientes, null, 2));
    })
    .catch((err: Error) => res.send(err.message));
};

// FIND AND SEND AN ARRAY WITH ALL THE INFORMATIONS ABOUT ALL THE CLIENTES
// ENCONTRA E ENVIA UM ARRAY COM TODAS AS INFORMAÇÕES SOBRE TODOS OS CLIENTES
const getAllClientes = (req: Request, res: Response) => {
  Cliente.findAll({ include: Endereço })
    .then(([clientes]: any) => {
      if (!clientes) {
        return res.send("Não há clientes registrados");
      }
      return res.send(JSON.stringify(clientes, null, 2));
    })
    .catch((err: Error) => res.send(err.message));
};

// FIND A CLIENTE BY IT'S "id" AND SEND IT'S INFORMATIONS
// ENCONTRA UM CLIENTE PELA SUA "id" E ENVIA SUAS INFORMAÇÕES
const getClienteById = (req: Request, res: Response) => {
  const clienteId = req.params.clienteId;
  Cliente.findOne({ where: { id: clienteId }, include: Endereço })
    .then((cliente: any) => {
      if (!cliente) {
        return res.send("Não existe cliente com a id informada!");
      }
      return res.send(JSON.stringify(cliente, null, 2));
    })
    .catch((err: Error) => res.send(err.message));
};

/////////////////////////////////// UPDATE ///////////////////////////////////

// EDIT A CLIENTE DATA BY IT'S "id"
// ALTERA OS DADOS DE UM CLIENTE PELA SUA "id"
const postEditClienteById = (req: Request, res: Response) => {
  const clienteId = req.params.clienteId;
  const changes = req.body;

  Cliente.update(changes, { where: { id: clienteId } })
    .then(([cliente]: any) => {
      if (cliente === 0) {
        return res.send(
          "O id informado não corresponde a um endereço cadastrado!"
        );
      }
      return res.send("Cliente Alterado!");
    })
    .catch((err: Error) => res.send(err.message));
};

// EDIT A ENDEREÇO DATA BY IT'S CLIENTE "id"
// ALTERA OS DADOS DE UM ENDEREÇO PELO "id" DO CLIENTE(dono do endereço)
const postEditEndereçoByIds = (req: Request, res: Response) => {
  const clienteId = req.params.clienteId;
  const enderecoId = req.params.enderecoId;
  const changes = req.body;

  Endereço.findOne({ where: { [Op.and]: [{ clienteId }, { id: enderecoId }] } })
    .then(async (endereço: any) => {
      if (!endereço) {
        return res.send(
          "Os ids informados não correspondem a um endereço existente!"
        );
      }
      await endereço.update(changes);
      return res.send("Endereço Alterado!");
    })
    .catch((err: Error) => res.send(err.message));
};

/////////////////////////////////// DELETE ///////////////////////////////////

// DELETE UM CLIENTE COM O ID QUE É PASSADO COMO PARAMETRO NA URL DA REQUISIÇÃO
const deleteClienteById = (req: Request, res: Response) => {
  const clienteId = req.params.clienteId;
  Endereço.destroy({ where: { clienteId } })
    .then(async (cliente: any) => {
      if (cliente === 0) {
        return res.send(
          "O id informado não corresponde a um endereço cadastrado!"
        );
      }
      await Cliente.destroy({ where: { id: clienteId } });
      return res.send("Cliente excluído com sucesso!");
    })
    .catch((err: Error) => res.send(err.message));
};

// ENCONTRA E DELETA UM ENDEREÇO DE UM CLIENTE COM OS RESPECTIVOS IDS PASSADOS COMO PARAMETRO NA URL DA REQUISIÇÃO
const deleteEndereçoByIds = (req: Request, res: Response) => {
  const clienteId = req.params.clienteId;
  const enderecoId = req.params.enderecoId;

  Endereço.findOne({
    where: { [Op.and]: [{ clienteId: clienteId }, { id: enderecoId }] },
  })
    .then(async (endereço: any) => {
      if (!endereço) {
        return res.send(
          "Os ids informado não correspondem a um endereço cadastrado!"
        );
      }
      await endereço.destroy();
      return res.send("Endereço excluído com sucesso!");
    })
    .catch((err: Error) => res.send(err.message));
};

export const clientesController = {
  postAddCliente: postAddCliente,
  getClientesNames: getClientesNames,
  getAllClientes: getAllClientes,
  getClienteById: getClienteById,
  postEditClienteById: postEditClienteById,
  postEditEndereçoByIds: postEditEndereçoByIds,
  postAddEndereço: postAddEndereço,
  deleteClienteById: deleteClienteById,
  deleteEndereçoByIds: deleteEndereçoByIds,
};
