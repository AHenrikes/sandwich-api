-- Sandwich secrets
INSERT INTO restaurant.api_keys (encrypted_key) VALUES (pgp_sym_encrypt('idkfa', 'idclip'));
