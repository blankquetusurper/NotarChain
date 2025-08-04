;; NotarChain - Document Registry Contract
;; Author: Ifeanyi
;; Language: Clarity v2

;; Error codes
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-DOC-ALREADY-EXISTS u101)
(define-constant ERR-DOC-NOT-FOUND u102)
(define-constant ERR-DOC-HASH-MISMATCH u103)
(define-constant ZERO-ADDRESS 'SP000000000000000000002Q6VF78)

;; Admin control
(define-data-var admin principal tx-sender)

;; Maps
(define-map documents
  (tuple (owner principal) (doc-id (buff 32)))
  (tuple
    (hash (buff 32))
    (timestamp uint)
    (jurisdiction (optional (string-utf8 20)))
    (metadata-uri (optional (string-utf8 100)))
  )
)

(define-map version-links
  (buff 32)
  (buff 32)
)

;; Check admin
(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

;; Set a new admin
(define-public (set-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (not (is-eq new-admin ZERO-ADDRESS)) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)

;; Register a new document
(define-public (register-document
  (doc-id (buff 32))
  (hash (buff 32))
  (jurisdiction (optional (string-utf8 20)))
  (metadata-uri (optional (string-utf8 100))))
  (let ((key (tuple (owner tx-sender) (doc-id doc-id))))
    (begin
      (asserts! (is-none (map-get? documents key)) (err ERR-DOC-ALREADY-EXISTS))
      (map-set documents key {
        hash: hash,
        timestamp: block-height,
        jurisdiction: jurisdiction,
        metadata-uri: metadata-uri
      })
      (ok true)
    )
  )
)

;; Retrieve a registered document
(define-read-only (get-document (owner principal) (doc-id (buff 32)))
  (let ((key (tuple (owner owner) (doc-id doc-id))))
    (match (map-get? documents key)
      some-doc (ok some-doc)
      none (err ERR-DOC-NOT-FOUND)
    )
  )
)

;; Link a new version of a document
(define-public (link-versions (old-hash (buff 32)) (new-hash (buff 32)))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (map-set version-links old-hash new-hash)
    (ok true)
  )
)

;; Resolve the latest document version
(define-read-only (get-latest-version (initial-hash (buff 32)))
  (let loop ((current initial-hash))
    (match (map-get? version-links current)
      next (loop next)
      none (ok current)
    )
  )
)

;; Verify that a document hash matches the stored value
(define-read-only (verify-document (owner principal) (doc-id (buff 32)) (hash (buff 32)))
  (let ((key (tuple (owner owner) (doc-id doc-id))))
    (match (map-get? documents key)
      doc (if (is-eq (get hash doc) hash)
              (ok true)
              (err ERR-DOC-HASH-MISMATCH))
      none (err ERR-DOC-NOT-FOUND)
    )
  )
)
