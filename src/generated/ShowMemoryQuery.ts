/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShowMemoryQuery
// ====================================================

export interface ShowMemoryQuery_memory_nearby {
  __typename: "Memory";
  id: string;
  latitude: number;
  longitude: number;
}

export interface ShowMemoryQuery_memory {
  __typename: "Memory";
  id: string;
  userId: string;
  message: string;
  publicId: string;
  hearts: number;
  latitude: number;
  longitude: number;
  nearby: ShowMemoryQuery_memory_nearby[];
}

export interface ShowMemoryQuery {
  memory: ShowMemoryQuery_memory | null;
}

export interface ShowMemoryQueryVariables {
  id: string;
}
