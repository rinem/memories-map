/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BoundsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: MemoriesQuery
// ====================================================

export interface MemoriesQuery_memories {
  __typename: "Memory";
  id: string;
  latitude: number;
  longitude: number;
  message: string;
  publicId: string;
  hearts: number;
}

export interface MemoriesQuery {
  memories: MemoriesQuery_memories[];
}

export interface MemoriesQueryVariables {
  bounds: BoundsInput;
}
