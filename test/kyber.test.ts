import { assertEquals } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";

import { Kyber1024, Kyber512, Kyber768 } from "../mod.ts";
import { loadCrypto } from "../src/utils.ts";
import { parseKAT, testVectorPath } from "./utils.ts";

[Kyber512, Kyber768, Kyber1024].forEach(KyberClass => describe(KyberClass.name, () => {
  describe("KAT vectors", () => {
    it("should match expected values", async () => {
      const kyber = new KyberClass();
      const katData = await Deno.readTextFile(
        `${testVectorPath()}/kat_MLKEM_${KyberClass.name.substring(5)}.rsp`,
      );
      const { ct, sk, ss } = parseKAT(katData);
      console.log(`test vector count: ${sk.length}`);

        for (let i = 0; i < sk.length; i++) {
          const res = await kyber.decap(ct[i], sk[i]);
          assertEquals(res, ss[i]);
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
  });
}));
