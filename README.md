# JB Training Coach

Crie um aplicativo completo de treino de academia para celular chamado JB TRAINING PRO, em português do Brasil.

O aplicativo deve funcionar como um assistente digital de treino, seguindo exatamente a ficha cadastrada pelo usuário e conduzindo-o durante toda a sessão.

1. TELA INICIAL

Criar uma tela inicial moderna, limpa e profissional.

Mostrar:

JB TRAINING PRO

Botões:

🏋️ INICIAR TREINO

📋 MINHAS FICHAS

📊 MEU PROGRESSO

🕘 HISTÓRICO

⚙️ CONFIGURAÇÕES

Mostrar também a última ficha utilizada e o último treino realizado.

2. CADASTRO DAS FICHAS

Permitir criar quantas fichas o usuário quiser.

Exemplos:

TREINO A – PEITO/TRÍCEPS

TREINO B – COSTAS/BÍCEPS

TREINO C – PERNAS

TREINO D – OMBROS

Cada exercício deve possuir:

Nome

Grupo muscular

Número de séries

Número de repetições

Carga

Unidade da carga (kg)

Tempo de descanso

Observações

Imagem do exercício

Campo para definir se a carga é por lado ou carga total

Exemplo:

SUPINO RETO

4 séries × 10 repetições Carga: 20 kg Descanso: 60 segundos

3. MODO TREINO

Ao selecionar uma ficha, mostrar um resumo:

TREINO A

7 exercícios 24 séries Tempo estimado: 55 minutos

Botão grande:

▶ INICIAR TREINO

Ao iniciar, começar automaticamente o cronômetro geral do treino.

4. TELA DO EXERCÍCIO

Durante o treino, deixar a interface extremamente simples.

Mostrar em destaque:

SUPINO RETO

Peito

SÉRIE 2 / 4

10 REPETIÇÕES

20 KG

Mostrar também:

"Última vez: 18 kg"

Botões grandes:

✓ CONCLUÍDA

⏭ PULAR

⏸ PAUSAR

5. ASSISTENTE POR VOZ

Adicionar comandos e avisos por voz.

Quando iniciar uma série, o aplicativo pode falar:

"Supino reto. Série 2 de 4. Dez repetições."

Quando a série for concluída:

"Série concluída. Descanso de 60 segundos."

Durante o descanso, opcionalmente informar:

"Faltam 30 segundos."

"Faltam 10 segundos."

"5... 4... 3... 2... 1."

Ao terminar:

"Descanso concluído. Próxima série."

Quando mudar de exercício:

"Próximo exercício: supino inclinado. Três séries de dez repetições."

Permitir ativar ou desativar a voz nas configurações.

6. CRONÔMETRO INTELIGENTE

Após concluir uma série, iniciar automaticamente o descanso.

Exemplo:

DESCANSO

01:00

O cronômetro deve ser grande e fácil de visualizar.

Adicionar:

+15 segundos -15 segundos PULAR

Quando chegar a zero:

emitir som;

vibrar;

falar "Descanso concluído";

mostrar "PRÓXIMA SÉRIE".

O usuário deve poder pausar o cronômetro.

7. CONTROLE AUTOMÁTICO DAS SÉRIES

O aplicativo deve controlar automaticamente:

Exercício 1 Série 1/4 ↓ Descanso ↓ Série 2/4 ↓ Descanso ↓ Série 3/4 ↓ Descanso ↓ Série 4/4 ↓ Descanso ↓ Próximo exercício

Não permitir que o aplicativo se perca na sequência mesmo se o usuário pausar o treino.

8. REGISTRO DA CARGA REAL

Durante cada série, permitir alterar a carga realizada.

Exemplo:

Ficha: 20 kg

Série 1: 20 kg

Série 2: 20 kg

Série 3: 22 kg

Série 4: 22 kg

Salvar cada série individualmente.

Adicionar botões:

− 1 kg + 1 kg

e permitir editar manualmente.

9. MEMÓRIA DA ÚLTIMA CARGA

Ao iniciar um exercício, mostrar:

Último treino 22 kg × 10

Carga programada 20 kg × 10

Isso permite que o usuário saiba quanto utilizou anteriormente.

10. EVOLUÇÃO

Criar uma área chamada:

MEU PROGRESSO

Permitir visualizar a evolução de cada exercício.

Exemplo:

SUPINO RETO

Data | Carga | Repetições

01/08 | 18 kg | 10 05/08 | 20 kg | 10 10/08 | 22 kg | 10

Criar gráficos simples mostrando a evolução da carga ao longo do tempo.

Também mostrar:

maior carga registrada;

última carga;

número de treinos realizados;

melhor desempenho registrado.

11. HISTÓRICO DE TREINOS

Salvar automaticamente cada treino.

Exemplo:

10/08/2026 TREINO A Duração: 54 min 7 exercícios 24 séries

Ao tocar no treino, mostrar todos os exercícios e as cargas utilizadas.

12. PAUSAR E RETOMAR

Criar botão:

PAUSAR TREINO

Ao pausar, parar o cronômetro e mostrar:

TREINO PAUSADO

[RETOMAR]

[ENCERRAR TREINO]

Se o usuário fechar o aplicativo acidentalmente, salvar o estado atual do treino e permitir continuar de onde parou.

13. FINALIZAÇÃO

Ao completar todos os exercícios:

Mostrar uma tela comemorativa:

TREINO CONCLUÍDO! 💪

Mostrar:

Tempo total Exercícios realizados Séries realizadas Carga total movimentada, quando possível calcular Data e horário

Botão:

VER RESUMO

e:

FINALIZAR

14. EDITOR DE FICHAS

Permitir:

adicionar exercícios;

excluir exercícios;

editar exercícios;

duplicar exercícios;

alterar ordem;

duplicar fichas;

renomear fichas.

Usar sistema de arrastar e soltar para reorganizar exercícios.

15. MODELO DE EXERCÍCIOS

Criar uma biblioteca inicial de exercícios.

Separar por:

PEITO COSTAS OMBROS BÍCEPS TRÍCEPS QUADRÍCEPS POSTERIOR DE COXA GLÚTEOS PANTURRILHAS ABDÔMEN

Permitir pesquisar pelo nome.

Também permitir criar exercícios personalizados.

16. CONFIGURAÇÕES

Criar:

Áudio

Voz ligada/desligada

Volume

Avisos durante o descanso

Aviso de início de série

Vibração

Ligada/desligada

Cronômetro

Som ao terminar

Descanso padrão

Contagem regressiva

Aparência

Tema claro

Tema escuro

Treino

Mostrar carga anterior

Mostrar histórico

Confirmar antes de pular exercício

17. MODO "TREINO RÁPIDO"

Criar uma opção para iniciar um treino sem cadastrar uma ficha completa.

O usuário escolhe:

Exercício Séries Repetições Carga Descanso

e começa imediatamente.

18. MODO RECUPERAÇÃO ENTRE EXERCÍCIOS

Diferenciar:

DESCANSO ENTRE SÉRIES

e

DESCANSO ENTRE EXERCÍCIOS

Permitir configurar tempos diferentes.

Exemplo:

Entre séries: 60 segundos

Entre exercícios: 90 segundos

19. SEGURANÇA E USABILIDADE

O aplicativo não deve incentivar o usuário a ultrapassar seus limites.

Não sugerir automaticamente aumento de carga como se fosse orientação médica ou profissional.

Quando apresentar informações de evolução, deixar claro que são apenas registros dos treinos.

Durante o treino, priorizar uma interface simples e fácil de visualizar.

Os botões devem ser grandes e fáceis de tocar.

20. FUNCIONAMENTO OFFLINE

As fichas, exercícios e histórico devem continuar disponíveis mesmo sem internet.

Sincronização online pode ser adicionada posteriormente.

21. DESIGN

Usar visual moderno de aplicativo fitness.

Interface predominantemente escura, com elementos de destaque.

Usar cartões grandes para os exercícios.

Durante o descanso, deixar o cronômetro como elemento principal da tela.

Exemplo:

┌─────────────────────────┐ │ DESCANSO │ │ │ │ 00:42 │ │ │ │ PRÓXIMA SÉRIE │ │ │ │ [-15] [PAUSAR] [+15] │ └─────────────────────────┘

Durante o exercício:

┌─────────────────────────┐ │ SUPINO RETO │ │ │ │ SÉRIE 3/4 │ │ │ │ 10 REPETIÇÕES │ │ │ │ 22 KG │ │ │ │ [✓ CONCLUÍDA] │ └─────────────────────────┘

22. BANCO DE DADOS

Criar estrutura para armazenar:

Usuário Fichas Exercícios Séries Repetições Cargas Tempos de descanso Treinos realizados Datas Duração Histórico de desempenho

Os dados não devem desaparecer quando o aplicativo for fechado.

23. RESPONSIVIDADE

O aplicativo deve ser desenvolvido primeiro pensando em smartphones.

Também deve funcionar adequadamente em tablets e telas maiores.

24. IMPORTANTE

Não criar apenas uma demonstração visual.

Quero um aplicativo funcional.

Os seguintes recursos precisam funcionar de verdade:

cadastro de fichas;

cadastro de exercícios;

edição;

sequência automática;

controle de séries;

cronômetro de descanso;

cronômetro geral;

avisos sonoros;

voz;

vibração;

registro de cargas;

histórico;

progresso;

armazenamento dos dados;

pausa e retomada;

funcionamento offline.

Primeiro construa a versão funcional completa.

Depois forneça instruções simples para executar o aplicativo, testar no celular e, se possível, gerar uma versão instalável para Android.

Priorize ferramentas e serviços gratuitos para desenvolvimento e testes.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://digital-gym-guide.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c4ce32a6-6e1b-402d-9487-db8c2954cbf2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
