/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MemoryInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateMemoryMutation
// ====================================================

export interface UpdateMemoryMutation_updateMemory {
  __typename: "Memory";
  id: string;
  image: string;
  publicId: string;
  latitude: number;
  longitude: number;
  hearts: number;
  message: string;
}

export interface UpdateMemoryMutation {
  updateMemory: UpdateMemoryMutation_updateMemory | null;
}

export interface UpdateMemoryMutationVariables {
  id: string;
  input: MemoryInput;
}
