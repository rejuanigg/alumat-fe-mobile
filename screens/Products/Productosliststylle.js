import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2E7', // Color de fondo beige claro del diseño
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  separator: {
    height: 2,
    backgroundColor: '#CCC',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#1C75B9',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#EEE',
    borderRadius: 5,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockBadge: {
    backgroundColor: '#D32F2F',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  stockText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#1C75B9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
});