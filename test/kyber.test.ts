import { describe, it } from "testing/bdd.ts";
import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.216.0/assert/mod.ts";

import { MlKem1024, MlKem512, MlKem768, MlKemError } from "../mod.ts";
import { loadCrypto } from "../src/utils.ts";
import { parseKAT, testVectorPath } from "./utils.ts";
import { hexToBytes } from "./utils.ts";

[MlKem512, MlKem768, MlKem1024].forEach((KyberClass) =>
  describe(KyberClass.name, () => {
    const size = KyberClass.name.substring(5);
    describe("KAT vectors", () => {
      it("should match expected values", async () => {
        const kyber = new KyberClass();
        const katData = await Deno.readTextFile(
          `${testVectorPath()}/kat/kat_MLKEM_${size}.rsp`,
        );
        const { ct, sk, ss, msg, pk } = parseKAT(katData);
        console.log(`test vector count: ${sk.length}`);

        for (let i = 0; i < sk.length; i++) {
          const ssDecapActual = await kyber.decap(ct[i], sk[i]);
          assertEquals(ssDecapActual, ss[i]);

          const [ctActual, ssEncapActual] = await kyber.encap(pk[i], msg[i]);
          assertEquals(ctActual, ct[i]);
          assertEquals(ssEncapActual, ss[i]);
        }
      });
    });

    describe("A sample code in README.", () => {
      it("should work normally", async () => {
        const recipient = new KyberClass();
        const [pkR, skR] = await recipient.generateKeyPair();

        const sender = new KyberClass();
        const [ct, ssS] = await sender.encap(pkR);

        const ssR = await recipient.decap(ct, skR);

        assertEquals(ssS, ssR);
      });

      it("should work normally with deriveKeyPair", async () => {
        const recipient = new KyberClass();
        const api = await loadCrypto();
        const seed = new Uint8Array(64);
        api.getRandomValues(seed);
        const [pkR, skR] = await recipient.deriveKeyPair(seed);
        const [pkR2, skR2] = await recipient.deriveKeyPair(seed);
        assertEquals(pkR, pkR2);
        assertEquals(skR, skR2);

        const sender = new KyberClass();
        const [ct, ssS] = await sender.encap(pkR);

        const ssR = await recipient.decap(ct, skR);

        assertEquals(ssS, ssR);
      });
    });

    describe("Advanced testing", () => {
      it("Invalid encapsulation keys", async () => {
        const sender = new KyberClass();
        const testData = await Deno.readTextFile(
          `${testVectorPath()}/modulus/ML-KEM-${size}.txt`,
        );
        const invalidPk = hexToBytes(testData);
        await assertRejects(
          () => sender.encap(invalidPk),
          MlKemError,
          "invalid encapsulation key",
        );
      });

      it("'Unlucky' vectors that require an unusually large number of XOF reads", async () => {
        const kyber = new KyberClass();
        const testData = await Deno.readTextFile(
          `${testVectorPath()}/unluckysample/ML-KEM-${size}.txt`,
        );
        const { c: [ct], dk: [sk], K: [ss] } = parseKAT(testData);
        const res = await kyber.decap(ct, sk);
        assertEquals(res, ss);
      });
    });
  })
);
