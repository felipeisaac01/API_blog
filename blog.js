const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

const server = new Koa();

server.use(bodyparser());

const posts = [];
const autores = [{
    id: 1,
    nome: 'yuky',
    sobrenome: 'akatoyose',
    email: 'yuky@gmail.com',
    senha: 'umasenhaaqui',
    deletado: true
}];

const buscarAutores = (codigo) => {
    let autor;

    for (i = 0; i < autores.length; i++) {
        if (codigo == autores[i].id) {
            autor = autores[i];
        };
    };

    if (autor) {
        return autor;
    } else {
        return false;
    };
};

const buscarPostDeAutorDeletado = (idDoAutor) => {

    for (i = 0; i < posts.length; i++) {
        if (idDoAutor == posts[i].autor) {
            posts[i].deletado = true;
        };
    };
    
};

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
            };
        } else if (path.includes('/posts')) {
            const { titulo = '-', subtitulo = '-', autor = '-'} = ctx.request.body;
            const novoPost = {
                id: posts.length + 1,
                titulo,
                subtitulo, 
                autor, 
                publicado: false, 
                deletado: false
            };
            const resgistroAutor = buscarAutores(autor);

            if (resgistroAutor.deletado) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'Autor deletado. Não é possível postar'
                    }
                };
            } else if (!resgistroAutor) {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    dados: {
                        mensagem: 'Autor não encontrado.'
                    }
                };
            } else {
                posts.unshift(novoPost);
                ctx.status = 200;
                ctx.body = {
                    status: 'sucesso',
                    dados: novoPost
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
                    } ;
                };
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

                    buscarPostDeAutorDeletado(id);
                } else {
                    ctx.status = 404;
                    ctx.body = {
                        status: 'error',
                        dados: {
                            mensagem: 'Autor inexistente.'
                        }
                    };
                };
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
    } else if (ctx.method === "PUT") {

        if (path.includes('/autor/')) {
            const id = Number(path.split('/')[2]);

            if (!(isNaN(id))) {
                const autor = buscarAutores(id);

                if (autor) {
                    const {dadoASerAlterado = '-', novoValor = '-'} = ctx.request.body;
                    autor[dadoASerAlterado] = novoValor;
                    ctx.body = {
                        status: 'sucesso',
                        dados: autor
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