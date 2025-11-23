import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLString, Kind } from 'graphql';

export const GraphQlJSON = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON value',
  parseValue: (value) => value,
  serialize: (value) => value,
  parseLiteral: (ast) => {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
      case Kind.INT:
      case Kind.FLOAT:
        return ast.value;

      case Kind.OBJECT: {
        const result = Object.create(null);

        ast.fields.forEach((field) => {
          result[field.name.value] = field.value;
        });

        return result;
      }
      
      default:
        return null;
    }
  },
});

export const OperationHistoryItemType = new GraphQLObjectType({
  name: 'OperationHistoryItem',
  fields: () => ({
    model: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    args: { type: GraphQlJSON },
  }),
});

export const PrismaStatsType = new GraphQLObjectType({
  name: 'Stats',
  fields: () => ({
    operationHistory: { type: new GraphQLList(OperationHistoryItemType) },
  }),
});
