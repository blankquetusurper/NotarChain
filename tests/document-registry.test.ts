import { describe, it, expect, beforeEach } from "vitest"

type DocKey = string
type Hash = string

interface Document {
  hash: Hash
  timestamp: number
  jurisdiction?: string
  metadataUri?: string
}

const makeKey = (owner: string, docId: string) => `${owner}:${docId}`

const mockRegistry = {
  admin: "ST1ADMIN",
  blockHeight: 1000,
  documents: new Map<DocKey, Document>(),
  versions: new Map<Hash, Hash>(),

  setAdmin(caller: string, newAdmin: string) {
    if (caller !== this.admin || newAdmin === "SP000000000000000000002Q6VF78") return { error: 100 }
    this.admin = newAdmin
    return { value: true }
  },

  registerDocument(caller: string, docId: string, hash: Hash, jurisdiction?: string, metadataUri?: string) {
    const key = makeKey(caller, docId)
    if (this.documents.has(key)) return { error: 101 }
    this.documents.set(key, {
      hash,
      timestamp: this.blockHeight,
      jurisdiction,
      metadataUri,
    })
    return { value: true }
  },

  getDocument(owner: string, docId: string) {
    const key = makeKey(owner, docId)
    const doc = this.documents.get(key)
    if (!doc) return { error: 102 }
    return { value: doc }
  },

  linkVersions(caller: string, oldHash: Hash, newHash: Hash) {
    if (caller !== this.admin) return { error: 100 }
    this.versions.set(oldHash, newHash)
    return { value: true }
  },

  getLatestVersion(hash: Hash): { value: Hash } {
    let current = hash
    while (this.versions.has(current)) {
      current = this.versions.get(current)!
    }
    return { value: current }
  },

  verifyDocument(owner: string, docId: string, hash: Hash) {
    const key = makeKey(owner, docId)
    const doc = this.documents.get(key)
    if (!doc) return { error: 102 }
    if (doc.hash !== hash) return { error: 103 }
    return { value: true }
  },
}

describe("Document Registry Contract", () => {
  const user = "ST2USER"
  const docId = "abcd1234"
  const hash = "HASH_1"
  const hash2 = "HASH_2"

  beforeEach(() => {
    mockRegistry.documents.clear()
    mockRegistry.versions.clear()
    mockRegistry.admin = "ST1ADMIN"
    mockRegistry.blockHeight = 1000
  })

  it("should register a document", () => {
    const result = mockRegistry.registerDocument(user, docId, hash, "NG", "ipfs://hash")
    expect(result).toEqual({ value: true })

    const doc = mockRegistry.getDocument(user, docId)
    expect(doc.value.hash).toBe(hash)
    expect(doc.value.jurisdiction).toBe("NG")
  })

  it("should not allow duplicate registration", () => {
    mockRegistry.registerDocument(user, docId, hash)
    const result = mockRegistry.registerDocument(user, docId, hash)
    expect(result).toEqual({ error: 101 })
  })

  it("should verify document hash", () => {
    mockRegistry.registerDocument(user, docId, hash)
    const verify = mockRegistry.verifyDocument(user, docId, hash)
    expect(verify).toEqual({ value: true })
  })

  it("should detect wrong hash", () => {
    mockRegistry.registerDocument(user, docId, hash)
    const verify = mockRegistry.verifyDocument(user, docId, "WRONG_HASH")
    expect(verify).toEqual({ error: 103 })
  })

  it("should link and resolve latest version", () => {
    mockRegistry.linkVersions("ST1ADMIN", hash, hash2)
    mockRegistry.linkVersions("ST1ADMIN", hash2, "HASH_3")
    const latest = mockRegistry.getLatestVersion(hash)
    expect(latest).toEqual({ value: "HASH_3" })
  })

  it("should prevent non-admin from linking versions", () => {
    const result = mockRegistry.linkVersions("ST2USER", hash, hash2)
    expect(result).toEqual({ error: 100 })
  })

  it("should update admin", () => {
    const result = mockRegistry.setAdmin("ST1ADMIN", "ST3NEWADMIN")
    expect(result).toEqual({ value: true })
    expect(mockRegistry.admin).toBe("ST3NEWADMIN")
  })

  it("should reject invalid admin change", () => {
    const result = mockRegistry.setAdmin("ST2USER", "SP000000000000000000002Q6VF78")
    expect(result).toEqual({ error: 100 })
  })
})
