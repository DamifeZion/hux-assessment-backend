export const contactDocs = {
   header: () => {
      /**
       * @swagger
       * tags:
       *   - name: Contact
       *     description: Contact management
       */
   },

   getContacts: () => {
      /**
       * @swagger
       * /api/v1/contact:
       *   get:
       *     summary: Get All Contacts
       *     description: Retrieve all contacts created by the currently authenticated user.
       *     tags: [Contact]
       *     responses:
       *       200:
       *         description: A list of contacts retrieved successfully.
       *         content:
       *           application/json:
       *             schema:
       *               type: array
       *               items:
       *                 type: object
       *                 properties:
       *                   id:
       *                     type: string
       *                     example: "614d1f77e6138d06f0c4f785"
       *                   firstname:
       *                     type: string
       *                     example: "John"
       *                   lastname:
       *                     type: string
       *                     example: "Doe"
       *                   phone:
       *                     type: string
       *                     example: "+123456789"
       *       404:
       *         description: No contacts found for this user.
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   type: string
       *                   example: "No contacts found."
       *       500:
       *         description: Internal server error.
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   type: string
       *                   example: "Internal server error."
       */
   },

   getContactDetails: () => {
      /**
       * @swagger
       * /api/v1/contact/{id}:
       *   get:
       *     summary: Get Contact Details
       *     description: Retrieve details of a specific contact by its ID.
       *     tags: [Contact]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: string
       *           example: "614d1f77e6138d06f0c4f785"
       *         description: The unique ID of the contact.
       *     responses:
       *       200:
       *         description: Contact details retrieved successfully.
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 id:
       *                   type: string
       *                   example: "614d1f77e6138d06f0c4f785"
       *                 firstname:
       *                   type: string
       *                   example: "John"
       *                 lastname:
       *                   type: string
       *                   example: "Doe"
       *                 phone:
       *                   type: string
       *                   example: "+123456789"
       *       404:
       *         description: Contact not found.
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   type: string
       *                   example: "Contact not found."
       *       500:
       *         description: Internal server error.
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   type: string
       *                   example: "Internal server error."
       */
   },

   editContact: () => {
      /**
       * @swagger
       * /api/v1/contact/{id}:
       *   put:
       *     summary: Edit a Contact
       *     description: Update the details of a specific contact by its ID.
       *     tags: [Contact]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: string
       *           example: "614d1f77e6138d06f0c4f785"
       *         description: The unique ID of the contact.
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               firstname:
       *                 type: string
       *                 example: "Jane"
       *               lastname:
       *                 type: string
       *                 example: "Doe"
       *               phone:
       *                 type: string
       *                 example: "+123456789"
       *     responses:
       *       200:
       *         description: Contact updated successfully.
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   type: string
       *                   example: "Contact Jane updated successfully."
       *       404:
       *         description: Contact not found.
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   type: string
       *                   example: "Contact does not exist."
       *       500:
       *         description: Internal server error.
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   type: string
       *                   example: "Internal server error."
       */
   },

   deleteContact: () => {
      /**
       * @swagger
       * /api/v1/contact/{id}:
       *   delete:
       *     summary: Delete a Contact
       *     description: Delete a specific contact by its ID.
       *     tags: [Contact]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: string
       *           example: "614d1f77e6138d06f0c4f785"
       *         description: The unique ID of the contact.
       *     responses:
       *       200:
       *         description: Contact deleted successfully.
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   type: string
       *                   example: "Contact Jane deleted successfully."
       *       404:
       *         description: Contact not found.
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   type: string
       *                   example: "Failed to delete contact, because contact does not exist."
       *       500:
       *         description: Internal server error.
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   type: string
       *                   example: "Internal server error."
       */
   },
};
