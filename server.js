import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
});

const Pocao = sequelize.define('Pocao', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT
    },
    imagem: {
        type: DataTypes.STRING
    },
    preco: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'pocoes',
    timestamps: false 
});

const Usuario = sequelize.define('Usuario', {
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    papel: {
        type: DataTypes.STRING,
        defaultValue: 'comum' 
    }
}, {
    tableName: 'usuarios',
    timestamps: false 
});

app.post('/api/login', async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        const usuarioEncontrado = await Usuario.findOne({ where: { usuario, senha } });

        if (usuarioEncontrado) {
            const token = usuarioEncontrado.papel === 'admin' ? 'permissao_admin' : 'permissao_comum';
            res.json({ 
                sucesso: true, 
                token: token, 
                papel: usuarioEncontrado.papel 
            });
        } else {
            res.status(401).json({ sucesso: false, mensagem: "Credenciais inválidas" });
        }
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: "Erro ao fazer login." });
    }
});

app.post('/api/registrar', async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        const usuarioExiste = await Usuario.findOne({ where: { usuario } });
        if (usuarioExiste) {
            return res.status(400).json({ sucesso: false, mensagem: "Este nome já está sendo utilizado" });
        }

        await Usuario.create({
            usuario: usuario,
            senha: senha,
            papel: 'comum'
        });

        res.json({ sucesso: true, mensagem: "Cadastro realizado com sucesso! Já pode fazer login." });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: "Falha ao registrar no pergaminho de usuários." });
    }
});


app.get('/api/pocoes', async (req, res) => {
    try {
        const pocoes = await Pocao.findAll(); 
        res.json(pocoes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/pocoes', async (req, res) => {
    try {
        const novaPocao = await Pocao.create(req.body);
        res.json(novaPocao);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/pocoes/:id', async (req, res) => {
    try {
        const deletados = await Pocao.destroy({
            where: { id: req.params.id }
        });
        
        if (deletados) {
            res.json({ mensagem: "Poção removida com sucesso" });
        } else {
            res.status(404).json({ error: "Poção não encontrada no estoque." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const vitrineInicial = [
    {
        nome: "Poção Blue Sky",
        descricao: "Essa poção provê um surto de inspiração por 24 horas. Foi utilizada por John Lennon quando escreveu Lucy in the Sky with Diamonds.",
        imagem: "https://i.ibb.co/ZzS7xb2/rsz-sky.png", 
        preco: 300
    },
    {
        nome: "Poção do Perfume Misterioso",
        descricao: "Essa poção faz com que você que cheirando lilás e groselha por 24 dias. Essência muito admirada pelos bruxos.",
        imagem: "https://i.ibb.co/pyhZJXf/rsz-lilas.png",
        preco: 200
    },
    {
        nome: "Poção de Pinus",
        descricao: "Essa poção faz com que você fique 10 cm mais alto! Observação: efeitos colaterais desconhecidos.",
        imagem: "https://i.ibb.co/DkzdL1q/rsz-pinus.png",
        preco: 3000
    },
    {
        nome: "Poção da Beleza Eterna",
        descricao: "Veneno que mata rápido.",
        imagem: "https://i.ibb.co/9p872NK/rsz-1beleza.png",
        preco: 100
    },
    {
        nome: "Poção do Arco Íro",
        descricao: "Traz felicidade momentânea. Pode durar de 10 minutos a 2 dias.",
        imagem: "https://i.ibb.co/PrC09MP/rsz-2unicornio.png",
        preco: 120
    },
    {
        nome: "Caldeirão das Verdades Secretas",
        descricao: "As pessoas lhe dirão apenas verdades por 1 hora. É necessário beber os 5L.",
        imagem: "https://i.ibb.co/s9Lyvj8/rsz-verdades.png",
        preco: 150
    }
];

sequelize.sync().then(async () => {
    console.log('Banco de dados Sequelize sincronizado com sucesso.');
    
    try {
        await Pocao.bulkCreate(vitrineInicial);
        console.log('Vitrine carregada!');

        await Usuario.create({
            usuario: "admin",
            senha: "pocao123", 
            papel: "admin"
        });
    } catch (erro) {
        console.error('Erro ao inicializar o servidor:', erro);
    }
    
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Acesse http://localhost:${PORT} para ver a vitrine.`);
        console.log(`Acesse http://localhost:${PORT}/admin.html para administrar.`);
    });
}).catch(err => {
    console.error('Falha ao sincronizar o banco de dados:', err);
});