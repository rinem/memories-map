/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BoundsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: MemorysQuery
// ====================================================

export interface MemorysQuery_memories {
  __typename: "Memory";
  id: string;
  latitude: number;
  longitude: number;
  message: string;
  publicId: string;
  hearts: number;
}

export interface MemorysQuery {
  memories: MemorysQuery_memories[];
}

export interface MemorysQueryVariables {
  bounds: BoundsInput;
}
