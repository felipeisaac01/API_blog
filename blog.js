const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

const server = new Koa();

server.use(bodyparser());

const posts = [];
const autores = [];

const buscarAutores = (codigo) => {
    let autor;

    for (i = 0; i < autores.length; i++) {
        if (codigo == autores[i].id) {
            autor = autores[i];
        }
    }

    if (autor) {
        return autor;
    } else {
        return false;
    }
}

server.use(ctx => {
    const path = ctx.url;

    if (ctx.method === "POST") {
        if (path.includes('/autor')) {
            const {id = autores.length + 1, nome = '-', sobrenome = '-', email = '-', senha = '-', deletado = false} = ctx.request.body;
            const novoAutor = {
                id,
                nome,
                sobrenome,
                email,
                senha,
                deletado
            };
            autores.push(novoAutor);

            ctx.status = 201;
            ctx.body = {
                status: 'sucesso',
                dados: novoAutor
            }
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                dados: {
                    mensagem: 'Não encontrado.'
                }
            };
        }
    } else if (ctx.method === "GET") {
        if (path.includes('/autor/')) {
            const id = Number(path.split('/')[2]);

            if (!(isNaN(id))) {
                const autor = buscarAutores(id);

                if (autor) {
                    ctx.body = {
                        status: 'sucesso',
                        dados: autor
                    }
                } else {
                    ctx.status = 404;
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensagem: 'Autor inexistente.'
                        }
                    } 
                }
            } else {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'Código inválido.'
                    }
                };
            };
        };
    } else if (ctx.method === 'DELETE') {
        if (path.includes('/autor/')) {
            const id = Number(path.split('/')[2]);

            if (!(isNaN(id))) {
                const autor = buscarAutores(id);

                if (autor) {
                    autor.deletado = true;
                    ctx.body = {
                        status: 'sucesso',
                        dados: autor
                    };
                    // deletar os posts desse autor!
                } else {
                    ctx.status = 404;
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensagem: 'Autor inexistente.'
                        }
                    };
                }
            } else {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'Código inválido.'
                    }
                };
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                dados: {
                    mensagem: 'Não encontrado.'
                }
            };
        };
    } else {
        ctx.status = 404;
        ctx.body = {
            status: 'error',
            dados: {
                mensagem: 'Autor inexistente.'
            }
        };
    };
});

server.listen(1908, () => console.log('servidor rodando sem problemas na porta 1908!'))