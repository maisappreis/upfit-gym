# Documentation of Business Rules

## Metrics

Dashboard composed of 4 graphs:

- Line graph displaying total monthly revenue versus expenses over the last 12 months.
- Pie chart displaying total active customers versus inactive customers over the last 12 months.
- Line graph displaying the number of active customers per month over the last 12 months.
- Bar graph displaying monthly profit over the last 12 months.

## Customers

Registration of active and inactive customers.

CRUD Rules:
- When creating an active Customer, a Revenue entry is created for that same customer in that month.
- Customers with a history of Revenue entries cannot be deleted, only deactivated.

## Revenue

Registration of all cash inflows related to the business.

CRUD Rules:
- When a Revenue value is changed, if this value is different from the value registered in the Customer, a message will ask about changing the registration and future revenue entries with this new value.
- When marking an Income as "Paid," a new income will be automatically created for the following month.

## Expenses

Registration of all cash outflows related to the business.

CRUD Rules:
- When marking an Expense as "Paid," a new expense will be automatically created for the following month.



----- Portuguese version -----

#  Documenção das Regras de Negócio

## Métricas

Dashboard composto por 4 gráficos:

- Gráfico de linha exibindo os totais de receitas versus despesas mensais nos últimos 12 meses.
- Gráfico de pizza exibindo total de clinetes ativos versus clientes inativos nos últimos 12 meses.
- Gráfico de linha exibindo número de clientes ativos por mês nos últimos 12 meses.
- Gráfico de barra exibindo lucro mensal dos últimos 12 meses.

## Clientes

Cadastro dos clientes ativos e inativos.

Regras de CRUD:
- Ao criar um Cliente ativo, uma Receita é criada para esse mesmo cliente naquele mês.
- Cliente com historico de Receitas não podem ser excluidos, apenas inativados.

## Receita

Cadastro de todas as entradas de dinheiro referentes ao negócio.

Regras de CRUD:
- Quando alterado um valor da Receita, se esse valor for diferente do valor cadastrado em Cliente, uma mensagem perguntará sobre alterar o cadastro e as proximas receitas com esse novo valor.
- Ao marcar uma Receita como "Pago", uma nova receita será criada automaticamente para o mês seguinte.

## Despesas

Cadastro de todas as saídas de dinheiro referentes ao negócio.

Regras de CRUD:
- Ao marcar uma Despesa como "Pago", uma nova despesa será criada automaticamente para o mês seguinte.