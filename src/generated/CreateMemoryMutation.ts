/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MemoryInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateMemoryMutation
// ====================================================

export interface CreateMemoryMutation_createMemory {
  __typename: "Memory";
  id: string;
}

export interface CreateMemoryMutation {
  createMemory: CreateMemoryMutation_createMemory | null;
}

export interface CreateMemoryMutationVariables {
  input: MemoryInput;
}
