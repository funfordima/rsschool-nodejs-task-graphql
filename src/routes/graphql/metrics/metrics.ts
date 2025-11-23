type OperationRecord = {
  model: string;
  operation: string;
  args: any;
};

export const operationHistory: OperationRecord[] = [];

export function logOperation(model: string, operation: string, args: any) {
  operationHistory.push({ model, operation, args });
}

export function getOperations() {
  return operationHistory;
}
